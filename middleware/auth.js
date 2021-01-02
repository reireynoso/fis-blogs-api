const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async(req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // {id: '32455566', iat: 12344343 (not sure what this is)}
        const user = await User.findOne({githubId: decoded.id})
        // console.log('auth', user)
        if(!user){
            
            throw new Error("Not a registered user. Register by logging in through Github");
        }

        req.token = token 
        req.user = user

        next()
    }catch(e){
        res.status(401).send({error: e.message})
    }
}

module.exports = auth