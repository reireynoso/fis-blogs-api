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
        type:String
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

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.githubId;
    // delete userObject._id;
    delete userObject.lastUpdated;
    return userObject;
}

userSchema.statics.findOrCreateOrUpdate = async(userData) => {
    // if exist, return that user info from your db. Info should NOT be from github response.
   
    let user = await User.findOne({
        githubId: userData.id
    })

    const {id, avatar_url,name,email,updated_at} = userData;
    // check if we need to update
    if(user && user.lastUpdated !== userData.updated_at){
        // update all fields for the document except the githubid. That shouldn't change on the Github side
        try {
            user.name = name;
            user.image_url = avatar_url;
            user.email = email;
            user.lastUpdated = updated_at;
            
            await user.save();   
        } catch (error) {
            console.log(error);
        }
    }

    // if not exist, create with certain data
    if(!user){
        user = new User({
            githubId: id,
            name,
            email,
            image_url: avatar_url,
            lastUpdated: updated_at
        })
        try{
            await user.save();

        }catch(e){
            console.log(e)
        }
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this
    
    user.name = user.name ? user.name : "";
    user.email = user.email ? user.email : "";

    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;