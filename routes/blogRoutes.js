const express = require('express')
const router = express.Router();
const { authenticate } = require('../middleware/auth');


const { getAllBlogs, getPopularBlogs, getSimilarBlogs, getBlogById, createBlog, updateBlog, deleteBlog, publishBlog } = require('../controllers/blogController');

//@desc get all blogs
//@route GET /api/blogs/
//@access Private/Public
router.route('/').get(getAllBlogs);

//@desc get popular blogs
//@route GET /api/blogs/popular
//@access Private/Public
router.route('/popular').get(getPopularBlogs);

//@desc get similar blogs 
//@route GET /api/blogs/similar
//@access Private/Public
router.route('/similar').get(getSimilarBlogs);

//@desc get blog with id
//@route GET /api/blogs/:id
//@access Public
router.route('/:id').get(getBlogById);

//@desc create new blog
//@route POST /api/blogs/
//@access Private
router.route('/').post(authenticate, createBlog);

//@desc publishes a drafted blog
//@route PUT /api/blogs/publish/:id
//@access Private
router.route('/publish/:id').put(authenticate, publishBlog);

//@desc update blog with id
//@route PUT /api/blogs/:id
//@access Private
router.route('/:id').put(authenticate, updateBlog);

//@desc delete blog with id
//@route DELETE /api/blogs/:id
//@access Private
router.route('/:id').delete(authenticate, deleteBlog);

module.exports = router;