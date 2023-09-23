const mongoose = require('mongoose');

const blogDetailSchema = mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    images: [String],
    updatedAt: Date,
})

const BlogDetail = mongoose.model('BlogDetail', blogDetailSchema);

module.exports = BlogDetail;