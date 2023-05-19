const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
});

connection.connect(function (error) {
    if (error) throw error;
    console.log("Connection Established");
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "form.html"));
});

app.post("/", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    connection.query("SELECT * FROM login WHERE username = ? AND password = ?", [email, password], function (error, results, fields) {
        if (error) {
            console.error("Error executing the login query: " + error.stack);
            return res.status(500).send("An error occurred during login.");
        }

        if (results.length > 0) {
            console.log(results);
            req.session.userId = results[0].id;
            res.render("loginSuccess",{data:results});
        } else {
            res.render("loginfailed");
        }
    });
});

app.listen(3500, () => {
    console.log('Server started on port 3500');
});
