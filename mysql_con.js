const mysql = require('mysql2')
require('dotenv').config()

const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});




con.connect(function (err) {
    console.log("Connected!");
});
module.exports = con