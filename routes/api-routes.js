var router = require('express').Router()
var db = require("../models");
var passport = require("../config/passport");
var Passport = require("passport");


// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post('/signin', function (req, res, next) {
    passport.authenticate('local-signin', function (err, user, info) {
        if (user) {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                } else {
                    res.redirect("/home")
                    // res.send({
                    //     success: true,
                    //     response: 'signup successful'
                    // });
                }
            });
        }

        if (user) {
            res.redirect("/home")
            // res.send({
            //     success: true,
            //     response: 'Authentication Success'
            // });
        }

        if (err) {
            res.send({
                success: false,
                response: 'Authentication failed'
            })
        }
    })(req, res, next);
});

router.post('/signup', function (req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
        if (user) {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                } else {
                    res.redirect("/home")
                    // res.send({
                    //     success: true,
                    //     response: 'signup successful'
                    // });
                }
            });
        }

        if (!user) {
            res.send({
                success: false,
                response: 'User exists already.'
            });
        }

        if (err) {
            res.send({
                success: false,
                response: 'Authentication failed'
            })
        }
    })(req, res, next);
});

// router.post('/signup', Passport.authenticate('local-signup', {
//     successRedirect: '/home',

//     failureRedirect: '/signin'
// }

// ));



// router.post('/signin', Passport.authenticate('local-signin', {
//     successRedirect: '/home',

//     failureRedirect: '/signin'
// }

// ));


router.get('/index', function (req, res) {
    res.render("index");
})

router.get("/logout", function (req, res) {
        res.render("index");
});

router.get('/home', isLoggedIn, function(req, res){
        res.render("home");
    
});

function isLoggedIn(req, res, next) {
 
    if (req.isAuthenticated())

        return next();

    res.redirect('/signin');

}


module.exports = router