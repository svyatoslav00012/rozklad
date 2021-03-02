const axios = require("axios");
const Config = require("./Config");
const fsp = require('fs').promises

const fetchRozklad = async () => axios.get(Config.FETCH_URL).then(res => res.data)

const setStoredRozklad = async rozklad => fsp.writeFile(Config.ROZKLAD_FILE, rozklad)

const getStoredRozklad = async () => {
    try{
        return await fsp.readFile(Config.ROZKLAD_FILE)
    } catch (e) {
        console.error(e)
        return null;
    }
}

module.exports = {
    fetchRozklad,
    setStoredRozklad,
    getStoredRozklad
}