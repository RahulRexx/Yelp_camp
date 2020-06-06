require("./config/config.js")
const express = require("express");
const bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose.js");
var {Campground} = require("./models/campgrounds.js");
var {Comment} = require("./models/comments.js");
var {seedDB} = require("./seed.js");


seedDB();
var app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));




app.get('/',(req,res) => {
    res.render('landing.ejs')
})

app.get("/test",(req,res) => {
    res.render("test.ejs");
})
app.get("/campgrounds",(req,res) => {
    Campground.find({},(err,allcampgrounds) => {
        if(err)
        {
            console.log("Error while fetching campground");
        }
        else{
            res.render('campgrounds/campgrounds.ejs', {
                campgrounds: allcampgrounds
            })
        }
    });
});

app.post("/campgrounds",(req,res) => {
    console.log("Post hitted");
    var name = req.body.name;
    var image =  req.body.image;
    var description =  req.body.description;
    var newcamp =new Campground ({ name , image, description});
    
    newcamp.save().then( (result) => {
        console.log("Saved Successfully");
    },(err) => {
        console.log("Error occured in post while saving");
    });

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs");
}); 

app.get("/campgrounds/:id",(req,res) => {
    // Campground.findById    (req.params.id, (err,campfound) => {
    Campground.findById(req.params.id).populate("comments").exec().then((campfound) => {

        // console.log(campfound);
        res.render("campgrounds/show.ejs", {
            campground: campfound
        });

    },(err) => {
        console.log(err);
    });
});

//===================comments ======================

app.get("/campgrounds/:id/comments/new", (req,res) => {
   Campground.findById(req.params.id,(err,campfound ) => {
       if(err)
       {
           console.log(err);
           res.redirect("/campgrounds");
       }
       else{
           console.log("new comment hitted");
          res.render("comments/new.ejs",{campgrounds : campfound});
       }
   })
});

app.post("/campgrounds/:id/comments",(req,res) => {

    Campground.findById(req.params.id,(err,campfound) => {
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment,(err,comment) => {
                if(err)
                {
                    console.log(err);
                }
                else{
                    campfound.comments.push(comment);
                    campfound.save();
                    res.redirect("/campgrounds/"+campfound._id);
                }
            });

        }
    });

});




app.listen(process.env.PORT,() => {
    console.log("Server has started v1");
});