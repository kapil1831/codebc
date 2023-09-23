
const Blog = require('../models/blogModel');
const BlogDetails = require('../models/blogDetailModel');

const getAllBlogs = async (req, res) => {

    let offset = req.query.offset;
    let limit = req.query.limit;

    console.log(limit);

    try {
        const blogs = await Blog.find().skip(offset).limit(limit).populate('author', 'name email -_id');
        res.status(200).json(
            blogs
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "something went wrong, try again!!!",
        })
    }
}

const getPopularBlogs = async (req, res) => {

    try {
        const popularBlogs = await Blog.find({}).sort({ upvotes: -1 }).limit(5).populate('author', "name email admin -_id");

        // console.log(popularBlogs);

        res.status(200).json(popularBlogs);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "something went wrong, try again!!!",
        })
    }

    // res.status(200).json({
    //     msg: "get popular Blogs",
    // })
}

const getSimilarBlogs = async (req, res) => {
    //it has to be a put kind of request sending us tags or title of doc we want similar doc
    const tags = req.body.tags;
    try {
        const similarBlogs = await Blog.find({}).sort({ upvotes: -1 }).limit(5).populate('author', "name email admin -_id");

        // console.log(popularBlogs);

        res.status(200).json(similarBlogs);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "something went wrong, try again!!!",
        })
    }
    // res.status(200).json({
    //     msg: "get similar Blogs",
    // })
}

const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate('author', 'name email -_id');
        res.status(200).json(
            blog
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "something went wrong, try again!!!",
        });
    }
}

// draft/publish a blog
const createBlog = async (req, res) => {

    if (isObjectEmpty(req.body)) {
        res.status(400).json({
            msg: "Nothing to create. You provided all fields empty",
        })
        return;
    }

    if (!(req.body.title) || !(req.body.content)) {
        res.status(400).json({
            msg: "Please add both title and content",
        })
        return;
    }

    try {
        // console.log(req.body.published); true/false/undefined
        const newBlog = {
            title: req.body.title,
            author: req.user._id,
            tags: req.body.tags,
            short: req.body.short_desc === null ? "" : req.body.short_desc,
            content: req.body.content,
            published: (req.body.published ? req.body.published : false),
        }

        const blog = await Blog.create(newBlog);

        console.log(blog);

        res.status(200).json({
            msg: `created Blog titled ' ${blog.title} ' successfully`,
            blog: await blog.populate('author', 'name email -_id')
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "something went wrong, try again!!!",
        });
    }
}

//publish a drafted blog by id
const publishBlog = async (req, res) => {

    try {
        const blogId = req.params.id;

        //[TODO] also if already published return msg that it is already published (more explicitly)
        const blog = await Blog.findOneAndUpdate({ _id: blogId, author: req.user._id, published: false }, {
            published: true,
        });

        console.log(blog);
        if (!blog) {
            // this can be true in 2 case only 
            // 1. blog doesn't exists
            // 2. user doesn't own blog
            res.status(400).json({
                msg: "no such blog or its already published",
            })
            return;
        }

        res.status(200).json({
            msg: `Published blog with id : ${blogId}`,
        });

    } catch (err) {
        console.log(err);
        req.status(500).json({
            msg: "something went wrong, try again!!!",
        });
    }
}

//check for an empty object
const isObjectEmpty = (objectName) => {
    return (
        objectName &&
        Object.keys(objectName).length === 0 &&
        objectName.constructor === Object
    );
};

const updateBlog = async (req, res) => {

    try {
        const blogId = req.params.id;

        if (isObjectEmpty(req.body)) {
            res.status(400).json({
                msg: "Nothing to update. You provided all fields empty"
            })
            return;
        }
        const updatedBlog = req.body;
        console.log(updatedBlog);

        //[TODO] if any user knowing blog id hits this route he will be able to update blog, we want user can only update their blogs or he's a admin
        //[TODO: NOT IMPORTANT] if user made no changes then block update request to this route
        const blog = await Blog.findOneAndUpdate({ _id: blogId, author: req.user._id }, updatedBlog);

        console.log(blog)

        if (!blog) {
            // this can be true in 2 case only 
            // 1. blog doesn't exists
            // 2. user doesn't own blog
            res.status(400).json({
                msg: "no such blog found. or you don't own this blog",
            })
            return;
        }
        res.status(200).json({
            msg: `updated Blog with id : ${req.params.id}`
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "something went wrong, try again!!!",
        })
    }
}

const deleteBlog = async (req, res) => {

    try {
        const blogId = req.params.id;

        //[TODO] if any user knowing blog id hits this route he will be able to delete blog, we want user can only delete their blogs or he's a admin
        const blog = await Blog.findOne({ _id: blogId, author: req.user._id });

        if (!blog) {
            //this is for, if another user try to delete a blog by direct api call, incase he wont be able to delete it,
            res.status(400).json({
                msg: "no such blog",
            })
            return;
        }

        const delblog = await Blog.deleteOne({ _id: blogId, author: req.user._id });

        //[TODO] if no record found then return appropriate response, in case if it is bcz of wrong user attempt to delete show warnings

        console.log("deleted blog : ", delblog);

        res.status(200).json({
            msg: `delete Blog with id : ${blogId}`,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "something went wrong, try again!!!" });
    }
}

module.exports = {
    getAllBlogs,
    getPopularBlogs,
    getSimilarBlogs,
    getBlogById,
    createBlog,
    publishBlog,
    updateBlog,
    deleteBlog
}