const express = require('express');
const router = new express.Router();
const axios = require('axios');

router.get("/testing", (req,res) => {
    try {
        res.send("tested")
    } catch (error) {
        res.send("error")
    }
})

router.get("/user/signin/callback", async(req,res) => {
    // after authorizing from github, we get redirected to this route (defined in the Github OAuth for the application)
    try {
        // when redirected here, the req comes with query.
        const {query} = req;
        // console.log(query)
        // ?code=132314
        // from the query, we have an object that contains the code. we use the code to gain an access token along with the client id and secret
        const {code} = query
        if(!code){
            return res.send({
                success: false,
                message: "Error. No Code"
            })
        }

        const accessToken = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token',
            data: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
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
        res.send(userInfo.data)
    } catch (error) {
        // console.log(error)
        res.send('waht')
    }
})

module.exports = router;