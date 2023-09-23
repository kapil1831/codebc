const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
    //associated images field
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    short: String,
    published: {
        type: Boolean,
        default: false,
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: () => {
            Date.now();
        }
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    content: {
        type: String,
        required: true,
        default: "blog has no content"
    },
    images: [String],
    updatedAt: Date,
});


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;