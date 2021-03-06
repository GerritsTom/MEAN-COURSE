const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // normally filtered by the frontend
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name =  file.originalname.toLowerCase().split('').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '_' +  Date.now() + '.' + ext);
  }
})

router.post("", checkAuth, multer({storage: storage}).single('image'),(req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Creating Post failed!"
    });
  })
})

router.get('', (req, res, next) => {
  Post.find()
    .then(response => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: response
      });
    }).catch(error => {
      res.status(500).json({
        message: "Could't get posts"
      });
    });;
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'Post not found!'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Could't get post"
      });
    });;
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({
      messages: "Posts with id " +req.params.id+ " deleted!"
    });
  }).catch(error => {
    res.status(500).json({
      message: "Could't delete post"
    });
  });;
})

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  // file as image or file as string
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath: url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Posts with id " +req.params.id+ " updated!"
        });
      } else {
        res.status(401).json({
          messages: "Post update failed!"
        });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Could't update post"
      });
    });
});

module.exports = router;
