const path = require('path');
const appDir = path.dirname(require.main.filename);

const Config = {
    VISITS_FILE: path.resolve(appDir, '..', 'files', 'visits'),
    ROZKLAD_FILE: path.resolve(appDir, '..', 'files', 'rozklad.html'),
    ROZKLAD_UPDATE_INTERVAL: 10 * 60 * 1000,
    VISITS_SAVE_INTERVAL: 2 * 1000,
    FETCH_URL: "https://student.lpnu.ua/students_schedule?departmentparent_abbrname_selective=%D0%86%D0%9A%D0%9D%D0%86&studygroup_abbrname_selective=%D0%9A%D0%9D-409&semestrduration=1"
}

module.exports = Config