const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoos = require('mongoose');

const app = express();

// connect to DB
// mongodb://localhost:27017
// mongodb+srv://admin:la8Ml5zuS8Xtl6FY@cluster0-qumye.mongodb.net/postDB?retryWrites=true
mongoos.connect("mongodb+srv://admin:la8Ml5zuS8Xtl6FY@cluster0-qumye.mongodb.net/postDB?retryWrites=true", {useNewUrlParser: true })
  .then(()=> {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
})

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(response => {
      res.status(200).json({
        messages: "Posts fetched successfully",
        posts: response
      });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      messages: "Posts with id " +req.params.id+ " deleted!"
    });
  })
})

module.exports = app;
