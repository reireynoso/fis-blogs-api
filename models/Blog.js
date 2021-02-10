const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cohort",
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

blogSchema.statics.findUserBlogs = async(user) => {
    const userBlogs = await Blog.find({
        user: user._id
    }).populate('user')

    return userBlogs
}

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;