const fs = require('fs');
const createDate = require('../createDate');

const reportErrors = (err, place) => {

    let date = createDate();
    let fullError = err;
    let whereOccured = place;
    let line = `
--- 

${date} --- ${fullError}

Wystąpił w linii: ${whereOccured}
`
    fs.appendFile(__dirname + '/report.txt', line, (err) => {
        if (err) throw err;
    })
}

module.exports = reportErrors;