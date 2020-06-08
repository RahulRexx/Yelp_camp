var express = require("express");
var router = express.Router();
var passport = require("passport");
var {User} = require("../models/users.js")



router.get('/', (req, res) => {
    res.render('landing.ejs')
});

//====================Authentication===================================================

router.get("/register", (req, res) => {

    res.render("register");
});


router.post("/register", (req, res) => {
    console.log(req.body.username, req.body.password);
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            // return res.redirect("/register");
            return res.render("register");
        }
        //local for local mode // facebook for facebook mode // twitter for twitter mode of authentication
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        })

    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

//passport.authenticate automatically takes the value that has been passed in the form 
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
    console.log("hitted");
});

router.get("/logout", (req, res) => {
    req.logout(); //req.logout() == passport destroys all the user data in the session ,it no longer keeping tracks of this user data in the session
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;