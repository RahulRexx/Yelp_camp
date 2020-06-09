var express = require("express");
var router = express.Router();
var {Campground} = require("../models/campgrounds.js");
var {Comment} = require("../models/comments.js");
var middleware = require("../middleware/middleware.js");

//=================================comments ============================================
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) => {
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

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {

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
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnerhip, (req, res) => {
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

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnerhip, (req, res) => {
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

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnerhip, (req, res) => {
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


module.exports = router;