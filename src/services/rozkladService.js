function rozkladService({redis, config, axios, htmlParsingService}) {

    const rq = url => axios.get(url).then(req => req.data)

    const fetchRozklad = async (institute = 'All', group = 'All') => {
        const start = Date.now()
        return rq(encodeURI(config.FETCH_URL(institute, group)))
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
                await redis.setAsync(`institute:${group}`, fetched, 'EX', 14 * 24 * 3600)
            return fetched
        }
        return cached
    }

    const fetchAndCacheRozklad = async group => {
        const inst = await getInstitute(group)
        const fetched = await fetchRozklad(inst, group)
        if (fetched) {
            const json = htmlParsingService.extractRozkladData(fetched)
            await redis.setAsync(`rozklad:${group}`, fetched, 'EX', 3600)
            await redis.setAsync(`rozklad-json:${group}`, JSON.stringify(json), 'EX', 3600)
            return {json, html: fetched}
        } else return null
    }

    const getRozklad = async (group) => {
        const cached = await redis.getAsync(`rozklad:${group}`)
        if (!cached)
            return fetchAndCacheRozklad(group)?.html
        return cached
    }

    const getRozkladData = async (group) => {
        const cached = JSON.parse(await redis.getAsync(`rozklad-json:${group}`))
        if (!cached)
            return fetchAndCacheRozklad(group)?.json
        return cached
    }

    const updateCachedRozklad = async () => {
        const groups = await fetchRozklad().then(htmlParsingService.extractGroups)
        const go = groupsLeft => {
            fetchAndCacheRozklad(groupsLeft[0])
            if (groupsLeft.length > 1)
                setTimeout(() => go(groupsLeft.slice(1)), 500)
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