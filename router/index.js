var express = require("express");
var router = express.Router();
var passport = require("passport");
var {User} = require("../models/users.js");
var middleware = require("../middleware/middleware.js");



router.get('/', (req, res) => {
    res.render('landing.ejs')
});

//====================Authentication===================================================

router.get("/register", (req, res) => {

    res.render("register");
});


router.post("/register", (req, res) => {
    // console.log(req.body.username, req.body.password);
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            // console.log("error is",err);
            req.flash("error","This username already exist!, Try  different one");
            return res.redirect("/register");
        }
        //local for local mode // facebook for facebook mode // twitter for twitter mode of authentication
        passport.authenticate("local")(req, res, () => {
            req.flash("success",`Hii ${req.body.username}! Welcome to the YelpCamp!`);
            res.redirect("/campgrounds");
        })

    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

// passport.authenticate automatically takes the value that has been passed in the form 
router.post("/login", passport.authenticate("local", {
    successFlash : "Welcome Back!",
    successRedirect: "/campgrounds",
    failureFlash: "Invalid Username or Password",
    failureRedirect: "/login"
    
}), (req, res) => {
});





router.get("/logout", (req, res) => {
    req.logout(); //req.logout() == passport destroys all the user data in the session ,it no longer keeping tracks of this user data in the session
    req.flash("success", "Logged out seccessfully. Look forward to seeing you again!");
    res.redirect("/campgrounds");
});



module.exports = router;