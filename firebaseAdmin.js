var serviceAccount = require(process.env.SERVICE_ACC_PATH);
const admin = require('firebase-admin');


const dbAdmin = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
}

module.exports = dbAdmin;