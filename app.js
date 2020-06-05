const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// To parse the body
var urlEncoder = bodyParser.urlencoded({ extended: true });

// Setup the mongodb connection
mongoose.connect('mongodb://localhost:27017/LogPoseDB', {useNewUrlParser: true, useUnifiedTopology: true});

const blogDBSchema = new mongoose.Schema({
    title: String,
    description: String
});

var Blog = mongoose.model("Blog", blogDBSchema);

// listen to the localhost:3000
app.listen(3000, function() {
    console.log("Example app listening at http://localhost:3000")
})

// Handle get requests
app.get("/", function(req,res) {
    Blog.find({}, function(err, data){
        if (err) {
            console.log(err);
        } else {
            if(data) {
                res.render("index", {listItems: data});
            }
        }
});
    // res.render("index");
})

// To create the doc 
app.get("/create", function(req,res) {
    res.render("create");
})

app.get("/fullArticle/:data", function(req,res){
    console.log(req.params.data);
    Blog.findById(req.params.data, function(err, data){
        if (!err) {
            if (data) {
                res.render("Article", {title: data.title, description: data.description})
            } else {
                data
            }
        } else {
            res.send("<h1> Some error Happened </h1>")
        }
    })
})

// Handle post requests
app.post("/", urlEncoder , function(req, res) {
    // Save the data in db.
    var blogPost = new Blog(req.body);
    blogPost.save()
    .then(item => {
        res.redirect("/");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});


