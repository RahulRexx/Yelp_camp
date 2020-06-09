var {Campground} = require("../models/campgrounds.js");
var {User} = require("../models/users.js");
var {Comment} = require("../models/comments.js");

var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in ");
    res.redirect("/login");
};

var checkCampgroundOwnerhip = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCamp) => {
            if (err) {
                res.render("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // res.send("NOT PERMITTED");
                    console.log("hitted edit");
                    req.flash("error","You do not have the Permission");
                    res.redirect("back");
                }

            }
        });

    } else {
        console.log("this is hitted");
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
};

var checkCommentOwnerhip = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.render("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // res.send("NOT PERMITTED");
                    console.log("hitted edit");
                    res.redirect("back");
                }

            }
        });

    } else {
        console.log("this is hitted");
        res.redirect("back");
    }
};

module.exports = {
    checkCampgroundOwnerhip,
    isLoggedIn,
    checkCommentOwnerhip
};