require("./config/config.js")
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");

var {mongoose} = require("./db/mongoose.js");
var {Campground} = require("./models/campgrounds.js");
var {Comment} = require("./models/comments.js");
var {User} = require("./models/users.js")
var {seedDB} = require("./seed.js");

var indexrouter = require("./router/index.js");
var commentrouter = require("./router/comment.js");
var campgroundrouter = require("./router/campground.js");
var testrouter = require("./router/test.js"); //

// seedDB();    //  stopped seed DB
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));
app.use(flash()); //flash configuration


app.use(methodOverride("_method"));


//======================Express-session=============================== (secret  will be used to encode and decode the sessions )
app.use(require("express-session")({
    secret: process.env.SECRET,
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
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use(indexrouter);
app.use(campgroundrouter);
app.use(commentrouter);



app.listen(process.env.PORT,() => {
    console.log("Server has started v1");
});