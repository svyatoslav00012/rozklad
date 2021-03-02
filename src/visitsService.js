const fs = require('fs')
const Config = require("./Config");

let visits = 0;

try {
    visits = fs.readFileSync(Config.VISITS_FILE)
} catch (e) {
    console.error("fail read visits")
    console.error(e)
}

const getVisits = () => visits

const incVisits = () => {visits++}

const saveVisits = () => fs.writeFileSync(Config.VISITS_FILE, visits+'')
setInterval(saveVisits, Config.VISITS_SAVE_INTERVAL)

module.exports = {
    getVisits,
    incVisits
}