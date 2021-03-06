const path = require('path');
const appDir = path.dirname(require.main.filename);

const Config = {
    redis: {
        port: 6379,
        host: process.env.REDIS_HOST || 'localhost'
    },
    ROZKLAD_UPDATE_INTERVAL: 6 * 60 * 60 * 1000,
    FETCH_URL: (institute, group) => `https://student.lpnu.ua/students_schedule?departmentparent_abbrname_selective=${institute}&studygroup_abbrname_selective=${group}&semestrduration=1`
}

module.exports = Config