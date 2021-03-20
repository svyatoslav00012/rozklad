function rozkladService({redis, config, axios, htmlParsingService}) {

    const rq = url => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        setTimeout(() => {
            source.cancel();
        }, config.REQUEST_TIMEOUT);
        return axios.get(url, {cancelToken: source.token}).then(req => req.data)
    }

    const fetchRozklad = async (institute = 'All', group = 'All') => {
        const start = Date.now()
        return await rq(encodeURI(config.FETCH_URL(institute, group)))
            .catch(err => {
                console.log(`failed to fetch ${group}`)
                return undefined;
            })
            .finally(() => console.log(`fetch ${group} took ${Date.now() - start}`))
    }

    const fetchInstitute = async group => fetchRozklad(null, group)
        .then(htmlParsingService.extractInstitutes)
        .then(_ => _[0])

    const getInstitute = async group => {
        const cached = await redis.getAsync(`institute:${group}`)
        if (!cached) {
            const fetched = await fetchInstitute(group)
            if (fetched)
                await redis.setAsync(`institute:${group}`, fetched)
            return fetched
        }
        return cached
    }

    const cacheRozklad = async (group, rozklad, json) => {
        await redis.setAsync(`rozklad:${group}`, rozklad, 'EX', config.ROZKLAD_EXPIRE)
        await redis.setAsync(`rozklad-json:${group}`, JSON.stringify(json), 'EX', config.ROZKLAD_EXPIRE)
        await redis.setAsync(`backup:rozklad:${group}`, rozklad)
        await redis.setAsync(`backup:rozklad-json:${group}`, JSON.stringify(json))
    }

    const fetchAndCacheRozklad = async group => {
        const inst = await getInstitute(group)
        const fetched = await fetchRozklad(inst, group)
        if (fetched) {
            const json = htmlParsingService.extractRozkladData(fetched)
            await cacheRozklad(group, fetched, json)
            return {json, html: fetched}
        } else return null
    }

    const getRozklad = async (group) => {
        const cached = await redis.getAsync(`rozklad:${group}`)
        if (!cached) {
            const fetched = (await fetchAndCacheRozklad(group))?.html
            if(!fetched){
                return await redis.getAsync(`backup:rozklad:${group}`)
            }
            return fetched
        }
        return cached
    }

    const getRozkladData = async (group) => {
        const cached = JSON.parse(await redis.getAsync(`rozklad-json:${group}`))
        if (!cached) {
            const fetched = (await fetchAndCacheRozklad(group))?.json
            if(!fetched){
                return await redis.getAsync(`backup:rozklad-json:${group}`)
            }
            return fetched
        }
        return cached
    }

    const updateCachedRozklad = async () => {
        const groups = await fetchRozklad().then(htmlParsingService.extractGroups)
        const go = groupsLeft => {
            fetchAndCacheRozklad(groupsLeft[0])
            if (groupsLeft.length > 1)
                setTimeout(() => go(groupsLeft.slice(1)), config.NEXT_GROUP_DELAY)
        }
        go(groups)
    }

    const initAutoUpdating = () => {
        updateCachedRozklad()
        setInterval(updateCachedRozklad, config.ROZKLAD_UPDATE_INTERVAL)
    }

    return {getRozklad, getRozkladData, initAutoUpdating}
}

module.exports = rozkladService