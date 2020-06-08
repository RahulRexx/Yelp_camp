require("./config/config.js")
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

var {mongoose} = require("./db/mongoose.js");
var {Campground} = require("./models/campgrounds.js");
var {Comment} = require("./models/comments.js");
var {User} = require("./models/users.js")
var {seedDB} = require("./seed.js");


seedDB();
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));


//======================Express-session=============================== (secret  will be used to encode and decode the sessions )
app.use(require("express-session")({
    secret: "This is the secret",
    resave: false,
    saveUninitialized: false
}));
//===========================Passport requirement===================================
app.use(passport.initialize());
app.use(passport.session());

//=========================passport==================================(They are responsible for reading the session & taking the data form the session ,encode it and unencoding it  )
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //encode it ,and put it back inn the session
passport.deserializeUser(User.deserializeUser()); // this "serializeUser" and "DeserializeUser" method is given by "passport-local-mongoose" on the User model;
//=================================================================

//====IMPORTANT MIDDLE WARE =======//
app.use((req,res,next) => { 
    res.locals.currentuser = req.user;
    next();
});


app.get('/',(req,res) => {
    res.render('landing.ejs')
})

app.get("/test",(req,res) => {
    res.render("test.ejs");
})
app.get("/campgrounds", (req, res) => {

    console.log(req.user);                         //important

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

app.post("/campgrounds",  (req, res) => {
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

app.get("/campgrounds/new", isLoggedIn,(req, res) => {
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

app.get("/campgrounds/:id/comments/new", isLoggedIn ,(req,res) => {
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

app.post("/campgrounds/:id/comments", isLoggedIn ,(req,res) => {

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

//=======================================================================

app.get("/register", (req, res) => {

    res.render("register");
});


app.post("/register", (req, res) => {
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

app.get("/login", (req, res) => {
    res.render("login");
});

//passport.authenticate automatically takes the value that has been passed in the form 
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
    console.log("hitted");
});

app.get("/logout", (req, res) => {
    req.logout(); //req.logout() == passport destroys all the user data in the session ,it no longer keeping tracks of this user data in the session
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};



app.listen(process.env.PORT,() => {
    console.log("Server has started v1");
});