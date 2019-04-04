const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const Post = require('./models/post');
const mongoos = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

// connect to DB
// mongodb://localhost:27017/postDB
// mongodb+srv://admin:la8Ml5zuS8Xtl6FY@cluster0-qumye.mongodb.net/postDB
mongoos.connect("mongodb://localhost:27017/postDB", {useNewUrlParser: true })
  .then(()=> {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// grant access to the image folder
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);


module.exports = app;
