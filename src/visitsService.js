const fs = require('fs')
const Config = require("./Config");

let visits = 0;

try {
    console.log(visits)
} catch (e) {
    console.error("fail read visits")
    console.error(e)
}

const getVisits = () => visits

const incVisits = () => {visits++}

const saveVisits = () => fs.writeFileSync(Config.VISITS_FILE, visits+'')
setInterval(saveVisits, 60*1000)

module.exports = {
    getVisits,
    incVisits
}