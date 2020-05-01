require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome, This is a personal blogging website created by Harsh Badera.";
const aboutContent = "Daily Journal - A personal blog created by me. I am a Computer Engineering student from Nashik pursuing my undergraduate degree from Sandip Institute of Technology and Research Centre. I have created this blog for practicing my skills with technologies like Node.JS and framework Express; MongoDB and its ODM Mongoose";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO,{useNewUrlParser:true,useUnifiedTopology:true});

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("post",postSchema);

app.get("/", function(req,res){
    Post.find(function(err,posts){
      res.render("home", {hst: homeStartingContent, pst: posts});
    });
});

app.get("/about", function(req,res){
    res.render("about", {apc: aboutContent});
});

app.get("/contact", function(req,res){
    res.render("contact");
});

app.get("/compose", function(req,res){
    res.render("compose");
});

app.post("/compose", function(req,res){
    const newPost = new Post({
      title: req.body.title,
      content: req.body.post
    });
    newPost.save(function(err){
      if(!err){
        res.redirect("/")
      }
    });
});

app.post("/", function(req,res){
  res.redirect("/");
});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

    Post.find(function(err,posts){

      posts.forEach(function(post){
            const storedTitle = _.lowerCase(post.title);
            if(storedTitle===requestedTitle) {
              res.render("post", {
                title: post.title,
                content: post.content
              })
            }
      });

})
});

app.post("/remove", function(req,res){
    const removeTitle = req.body.delete;
    Post.deleteOne({title:removeTitle}, function(err){
      if(!err){
        res.redirect("/");
      }
    })
});



app.listen(3000, function() {
  console.log("Server running on port 3000");
});
