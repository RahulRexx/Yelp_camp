var express = require("express");
var router = express.Router();
var {Campground} = require("../models/campgrounds.js");
var {Comment} = require("../models/comments.js");


//=================================comments ============================================
router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campfound) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log("new comment hitted");
            res.render("comments/new.ejs", {
                campgrounds: campfound
            });
        }
    })
});

router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {

    Campground.findById(req.params.id, (err, campfound) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id= req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // console.log(comment);
                    
                    campfound.comments.push(comment);
                    campfound.save();
                    res.redirect("/campgrounds/" + campfound._id);
                }
            });

        }
    });

});


//edit================================
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnerhip, (req, res) => {
        Comment.findById(req.params.comment_id,(err,commentfound) => {
            if (err) {
                res.redirect("back");
            } else {
                // console.log(commentfound);
                
                res.render("comments/edit", {
                    campground_id: req.params.id,
                    comment : commentfound
                });
            }
        });
});

router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnerhip , (req, res) => {
        // res.send("Update route");
        Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment , (err,Updated) => {
            if(err)
            {
                res.render("back");
            }
            else{
                // console.log(Updated);
                
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
});
//destroy route======================================================================================

router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnerhip, (req, res) => {
    // res.send("Delete  route");
    Comment.findByIdAndRemove(req.params.comment_id, (err, result) => {
        if (err) {
            // console.log(err);
            res.redirect("back");
            } else {
            console.log(result);
            res.redirect("/campgrounds/"  + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

function checkCommentOwnerhip(req, res, next) {
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

module.exports = router;