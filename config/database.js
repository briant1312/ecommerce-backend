const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);

db.connect()
    .then((obj) => {
        console.log("Connected to database");
        obj.done();
    })
    .catch(err => {
        console.error("error connecting to database", err.message);
    })

module.exports = db;
