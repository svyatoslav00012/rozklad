const app = require('express')()

const visitsServiceConstructor = require("./services/visitsService");
const htmlParsingServerConstructor = require("./services/htmlParsingService");
const rozkladServiceConstructor = require("./services/rozkladService");

const Config = require("./Config");
const redisClient = require('./redisClient/redisClient')
const axios = require('axios')

const visitsService = visitsServiceConstructor({config: Config, redisClient})
const htmlParsingService = htmlParsingServerConstructor()
const rozkladService = rozkladServiceConstructor({
    redis: redisClient, config: Config, htmlParsingService, axios
})

const pretty = json => `<div style="white-space: break-spaces">${JSON.stringify(json, 2, 4)}</div>`

rozkladService.initAutoUpdating()

app.get('/visits/:group', async (req, res) => {
    const visits = await visitsService.getVisits(req.params.group)
    res.status(200).send(visits)
})

app.get('/visits', async (req, res) => {
    const visits = await visitsService.getAllVisits()
    res.status(200).send(pretty(visits))
})

app.get('/api/visits', async (req, res) => {
    const visits = await visitsService.getAllVisits()
    res.status(200).json(visits)
})

app.get('/', (req, res) => res.redirect('/КН-409'))

app.get('/:groupId', async (req, res) => {
    if(req.params.groupId === 'favicon.ico') {
        res.sendStatus(404)
    } else {
        visitsService.incVisits(req.params.groupId)
        rozkladService.getRozklad(req.params.groupId).then(rozk => res.status(200).send(rozk))
    }
})

app.get('/api/:groupId', async (req, res) => {
    visitsService.incVisits('api/'+req.params.groupId)
    rozkladService.getRozkladData(req.params.groupId).then(rozk => res.status(200).json(rozk))
})

app.get('/api/pretty/:groupId', async (req, res) => {
    visitsService.incVisits('api/pretty/'+req.params.groupId)
    rozkladService.getRozkladData(req.params.groupId).then(rozk => res.status(200).send(pretty(rozk)))
})

app.listen(5001, () => console.log('listening'))
