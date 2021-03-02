const Config = require("./Config");
const {fetchRozklad, getStoredRozklad, setStoredRozklad} = require("./rozkladActions");
let cahcedRozklad = null

const updateRozklad = async () => {
    try {
        cahcedRozklad = await fetchRozklad()
        await setStoredRozklad(cahcedRozklad)
        return cahcedRozklad
    } catch (e) {
        console.error(e)
        return null
    }
}

const getStored = async () => {
    cahcedRozklad = await getStoredRozklad()
    return cahcedRozklad
}

const getRozklad = async () => cahcedRozklad || await getStored() || await updateRozklad()

updateRozklad()
setInterval(updateRozklad, Config.ROZKLAD_UPDATE_INTERVAL)

module.exports = {
    getRozklad
}