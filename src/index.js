const {incVisits, getVisits} = require("./visitsService");
const {getRozklad} = require("./rozkladService");
const app = require('express')()

app.get('/visits', (req, res) => res.status(200).send(getVisits()+''))

app.get('/', async (req, res) => {
    incVisits();
    const rozk = await getRozklad()
    res.status(200).send(rozk.toString() || 'Не вдалося завантажити розклад')
})


app.listen(5001, () => console.log('listening'))
