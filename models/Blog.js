const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    cohort: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;