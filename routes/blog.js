const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res)=>{
  return res.render('addBlog', {
    user: req.user
  })
})

router.post('/add-new', upload.single('coverImage'), async (req, res)=>{
  const { title, body }  = req.body;
  const blog = await Blog.create({
    title,
    body, 
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`
  })
  return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id', async (req, res)=>{
  const comments = await Comment.find({blogId: req.params.id}).populate('createdBy');
  const blog = await Blog.findById(req.params.id);
  return res.render('blog', {
    user: req.user,
    blog,
    comments
  })
})

router.post('/comment/:id', async (req, res)=>{
  if(!req.user) return res.redirect('/user/signin');
  await Comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.id}`);
})

module.exports = router;