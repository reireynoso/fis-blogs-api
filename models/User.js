const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    githubId: {
        type: String,
        required: true
    },
    name: {
        type:String
    },
    email: {
        type:String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    image_url: {
        type: String
    },
    // check if any has been updated on github since last time. If it has update it on our db
    lastUpdated: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;