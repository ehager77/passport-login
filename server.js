// ---------------------------------------------------
// Dependencies
// ---------------------------------------------------
// load the Express node package
var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var bodyParser = require('body-parser')
var env = require('dotenv').config();
var exphbs = require("express-handlebars");
// set port
var PORT = process.env.PORT || 3000;
// --------------------------------------------------- 
// set up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// For Passport
app.use(session({ secret: process.env.passport_secret, resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// ---------------------------------------------------
// Set handlebars as the default templating engine
// ---------------------------------------------------
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// set up the Express app so it will be able to use my css stylesheet, the images and the js file
app.use(express.static("public"));

// models
var db = require("./models");

// ---------------------------------------------------
// Routes
// --------------------------------------------------- 
var routes = require("./routes/html-routes")
var apiRoutes = require("./routes/api-routes")
// var controllers = require("./controllers/spotCheck-controllers.js");
app.use(routes)
// app.use(controllers)
app.use(apiRoutes)

// passport strategies
require('./config/passport');

// ---------------------------------------------------
// Start the server
// --------------------------------------------------- 

db.sequelize.sync().then(function () {
    console.log("Datbase Synced!")
app.listen(PORT, function (err) {
    if(!err){
        console.log("App listening on PORT " + PORT);
    }
    else console.log(err)
});
    
});

module.exports = app;
