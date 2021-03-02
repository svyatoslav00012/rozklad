const {incVisits, getVisits} = require("./visitsService");
const {getRozklad} = require("./rozkladService");
const app = require('express')()

app.get('/visits', (req, res) => res.status(200).send(getVisits()+''))

app.get('/', async (req, res) => {
    incVisits();
    const rozk = await getRozklad()
    res.status(200).send(rozk.toString())
})


app.listen(5005, () => console.log('listening'))
