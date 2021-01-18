const createDate = require('../createDate');

const updateLastActiveDate = (req, res, next) => {
    console.log(createDate())
    next()
}

module.exports = updateLastActiveDate;