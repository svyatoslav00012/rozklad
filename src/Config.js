const path = require('path');
const appDir = path.dirname(require.main.filename);

const Config = {
    redis: {
        port: 6379,
        host: process.env.REDIS_HOST || 'localhost'
    },
    ROZKLAD_EXPIRE: 2*3600,
    NEXT_GROUP_DELAY: 1000,
    REQUEST_TIMEOUT: 5000,
    ROZKLAD_UPDATE_INTERVAL: 6 * 3600 * 1000,
    FETCH_URL: (institute, group) => `https://student.lpnu.ua/students_schedule?departmentparent_abbrname_selective=${institute}&studygroup_abbrname_selective=${group}&semestrduration=1`
}

module.exports = Config