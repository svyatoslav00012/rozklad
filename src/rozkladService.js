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

const getRozklad = async () => cahcedRozklad || await getStoredRozklad() || await updateRozklad()

updateRozklad()
setInterval(updateRozklad, 10 * 60 * 1000)

module.exports = {
    getRozklad
}