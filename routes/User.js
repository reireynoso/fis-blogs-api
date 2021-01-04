const express = require("express");
const router = new express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Blog = require('../models/Blog');

router.post("/user/login", async(req,res) => {
    // after authorizing from github, we get redirected to this route (defined in the Github OAuth for the application)
    try {
        // when redirected here, the req comes with query.
        // const {query} = req;
        // console.log(query)
        // ?code=132314
        // from the query, we have an object that contains the code. we use the code to gain an access token along with the client id and secret
        // const {code} = query
        // if(!code){
        //     return res.send({
        //         success: false,
        //         message: "Error. No Code"
        //     })
        // }
        // client is making a request with the code included in the body
        const code = req.body.code;
        const accessToken = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token',
            data: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                // redirect_uri: 'http://localhost:3000/'
            },
            headers: {'Accept': 'application/json'}
          })
          .then(res.data)
        
        // using the access token, we gain the information from github
        const userInfo = await axios({
            url: 'https://api.github.com/user',
            method: "get",
            headers: {
                Authorization: 'token ' + accessToken.data["access_token"]
            }
        }).then(res.data)
        // console.log(userInfo.data)
        // user info data from github
        // {
        //     login: '',
        //     id: ,
        //     node_id: '',
        //     avatar_url: '',
        //     gravatar_id: '',
        //     url: '',
        //     html_url: '',
        //     followers_url: '',
        //     following_url: '',
        //     gists_url: '',
        //     starred_url: '',
        //     subscriptions_url: '',
        //     organizations_url: '',
        //     repos_url: '',
        //     events_url: '',
        //     received_events_url: '',
        //     type: '',
        //     site_admin: false,
        //     name: '',
        //     company: null,
        //     blog: '',
        //     location: '',
        //     email: null,
        //     hireable: null,
        //     bio: '',
        //     twitter_username: null,
        //     public_repos: ,
        //     public_gists: ,
        //     followers: ,
        //     following: ,
        //     created_at: '',
        //     updated_at: ''
        //   }
        const userData = userInfo.data
        // console.log(userData.id)
        // from the user information returned from Github, check if a user with that github id exists in the db
        const user = await User.findOrCreateOrUpdate(userData)
         // if exist, return that user info from your db. Info should NOT be from github response.
        // if not exist, create with certain data
        // find blogs associated with user
        const userBlogs = await Blog.findUserBlogs(user);
        
        const token = jwt.sign({id: userData.id.toString()}, process.env.JWT_SECRET)
        res.send({user, token, userBlogs})
    } catch (error) {
        // console.log(error)
        res.send({error})
    }
})

router.get('/auto_login', auth, async(req,res) => {
    // find blogs associated with user
    const userBlogs = await Blog.findUserBlogs(req.user);
    res.send({user: req.user, userBlogs});
})

module.exports = router;