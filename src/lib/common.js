var moment = require('moment');

function getCurrentDate() {
    return moment.utc().format('DD-MM-YYYY');
}

function genKey(entity) {
    return entity + ':' + getCurrentDate();
}

module.exports.getCurrentDate = getCurrentDate;
module.exports.genKey = genKey;