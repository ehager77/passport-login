// import passport packages
var bCrypt = require('bcrypt-nodejs')
var passport = require('passport');
// Need models to check passport
var db = require("../models");
var LocalStrategy = require("passport-local").Strategy;


// Telling passport we want to use a local strategy.  
// In other words, we want login with username/phonenumber and password

passport.use("local-signup", new LocalStrategy(

    {
        usernameField: "phoneNumber",
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function (req, phoneNumber, password, done) {

        var generateHash = function (password) {

            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

        };

        db.users.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        }).then(function (user, err) {
            console.log('I entered' + user);
            console.log('I entered' + err);
            if (err) {
                console.log(err);
                return done(null, false);
            }

            if (user) {
                return done(null, false, {
                    message: "You've already been registered.  Please sign in."
                });
            }
            else {
                var userPassword = generateHash(password);
                console.log("pass hashed", password, userPassword)

                var data =
                {
                    phoneNumber: phoneNumber,
                    password: userPassword

                };

                db.users.create(data).then(function (newUser, created) {
                    if (!newUser) {
                        return done(null, false);
                    }
                    if (newUser) {
                        return done(null, newUser)

                    }
                });
            }



        });
    }

));

//LOCAL SIGNIN
passport.use('local-signin', new LocalStrategy(
 
    {
 
        // by default, local strategy uses username and password, we will override with email
 
        usernameField: 'phoneNumber',
 
        passwordField: 'password',
 
        passReqToCallback: true // allows us to pass back the entire request to the callback
 
    },
 
 
    function(req, phoneNumber, password, done) {
 
 
        var isValidPassword = function(userpass, password) {
 
            return bCrypt.compareSync(password, userpass);
 
        }
 
        db.users.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        }).then(function(user) {
 
            if (!user) {
 
                return done(null, false, {
                    message: 'User does not exist'
                });
 
            }
 
            if (!isValidPassword(user.password, password)) {

 
                return done(null, false, {
                    message: 'Incorrect password.'
                });
 
            }
 
 
            var userinfo = db.users;
            return done(null, userinfo);
 
 
        }).catch(function(err) {
 
            console.log("Error:", err);
 
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
 
        });
 
 
    }
 
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.users.findByPk(id).then(function (user) {
        if (user) {
            done(null, user);
        } else {
            done(user.errors, null)
        }

    })

});

module.exports = passport;