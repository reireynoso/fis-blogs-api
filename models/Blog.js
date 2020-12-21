const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    tags: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    cohort: {
        type: String,
        require: true,
    },
    image: {
        type: String
    },
    approved: {
        type: Boolean,
        default: false
    }
})

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;