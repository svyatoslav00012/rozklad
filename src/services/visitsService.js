function visitsService({config, redisClient}){
    const count = filter => visits =>  Object.entries(visits)
        .filter(_ => !_[0].startsWith('favicon'))
        .filter(filter)
        .reduce((acc, cur) => acc + parseInt(cur[1]), 0)

    const getAllVisits = async () => {
        const v = (await redisClient.hgetallAsync('visits')) || {}
        delete v['favicon.ico']
        return {
            total: count(_ => true)(v),
            api: {
                plain: count(_ => _[0].startsWith('api') && !_[0].startsWith('api/pretty'))(v),
                pretty: count(_ => _[0].startsWith('api/pretty'))(v),
                total: count(_ => _[0].startsWith('api'))(v)
            },
            direct: count(_ => !_[0].startsWith('api'))(v),
            visits: v,
        }
    }

    const getVisits = group => redisClient.hgetAsync('visits', group)

    const incVisits = group => redisClient.hincrbyAsync('visits', group, 1)

    return {getAllVisits, getVisits, incVisits}
}

module.exports = visitsService