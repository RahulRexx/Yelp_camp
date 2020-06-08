var mongoose = require("mongoose");

var {Campground} = require("./models/campgrounds.js");
var {Comment} = require("./models/comments.js");


var data = [
    {
        name : "First",
        image: "https://images.unsplash.com/photo-1542067519-6cd1e217df2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name : "second",
        image: " https://images.unsplash.com/photo-1564577160324-112d603f750f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name : "third",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }


]

function seedDB() {

    Campground.remove({}).then((res) => {
        console.log("campground removed", res);
        data.forEach((item) => {
            Campground.create(item).then((result) => {
                console.log("created");

                Comment.create({
                    text : "This is awesome",
                    author : "Rahul"
                }).then( (res) => {
                    result.comments.push(res);
                    result.save();                      //this is important
                    // console.log(result);
                    console.log("comment created");
                },(err) => {
                    console.log("comment failed ",err);
                });
            }, (err) => {
                console.log(err);
            });
        });

    }, (err) => {
        console.log(err);
    });
    
};

    
  
    



module.exports = {
    seedDB 
};