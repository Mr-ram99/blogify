const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const Blog = require('./models/blog');
const { checkForAuthCookie } = require('./middlewares/authentication');
const app = express();
const PORT = 8000;
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve('./public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(()=>{
  console.log('mongodb connected');
})
app.use(cookieParser());
app.use(checkForAuthCookie("token"));

app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.get('/', async (req, res)=>{
  const allBlogs = await Blog.find();
  console.log(allBlogs)
  res.render('home', {
    user: req.user,
    blogs: allBlogs
  });
})
app.listen(PORT, ()=>{
  console.log(`listening on port ${PORT}`);
})