const mysql = require('mysql2')
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "movie_web"
});

con.connect(function (err) {
    console.log("Connected!");
});
module.exports = con