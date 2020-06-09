var express = require("express");
var router = express.Router();
var {Campground} = require("../models/campgrounds.js");
var middleware  = require("../middleware/middleware.js");

router.get("/test", (req, res) => {
    res.render("test.ejs");
});

router.get("/campgrounds", (req, res) => {

    // console.log("logged or not",req.user); //important

    Campground.find({}, (err, allcampgrounds) => {
        if (err) {
            console.log("Error while fetching campground");
        } else {
            res.render('campgrounds/campgrounds.ejs', {
                campgrounds: allcampgrounds
            })
        }
    });
});

router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
    console.log("Post hitted");
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newcamp = new Campground({
        name,
        image,
        description,
        author
    });

    newcamp.save().then((result) => {
        console.log("Saved Successfully",result);
    }, (err) => {
        console.log("Error occured in post while saving");
    });

    res.redirect("/campgrounds");
});

router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

router.get("/campgrounds/:id", (req, res) => {
    // Campground.findById    (req.params.id, (err,campfound) => {
    Campground.findById(req.params.id).populate("comments").exec().then((campfound) => {

        // console.log(campfound);
        res.render("campgrounds/show.ejs", {
            campground: campfound
        });

    }, (err) => {
        console.log(err);
    });
});

//edit route =========================================
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnerhip, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        if (err) {
            res.render("back");
        }
        else{
            res.render("campgrounds/edit", {
                campground: foundCamp
            });
        }
    });
    
});

router.put("/campgrounds/:id", middleware.checkCampgroundOwnerhip, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id,req.body.campground ,(err,campfound) => {
        if(err)
        {
            console.log("error in edit route");
            res.redirect("/campgrounds");
        }
        else{
            console.log('edit hitted');
            
            res.redirect("/campgrounds/"+campfound._id);
        }
    });
});

// Delete =====================
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnerhip, (req, res) => {
    Campground.findByIdAndRemove(req.params.id,(err,result) =>{
        if(err)
        {
            console.log(err);
        }
        else{
            console.log(result);
            res.redirect("/campgrounds");
        }
    } );
});





module.exports = router;