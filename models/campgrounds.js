var mongoose = require("mongoose");
var {Comment} =require("./comments.js")

var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    comments : [
        {
            type  : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
});

var Campground = mongoose.model("Campgrounds",campgroundSchema);


module.exports = {
    Campground : Campground
}