const express = require('express');
const router = new express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const auth = require('../middleware/auth');
const CustomError = require('../custom-error/custom-error');
const acceptableTags = require('../data/tags');
const Cohort = require('../models/Cohort');
const Blog = require('../models/Blog');

router.get("/testing", async(_,res) => {
    try {
        res.send("tested")
    } catch (error) {
        res.send({error: error.message})
    }
})

// router.get("/blog/me", auth, async(req,res) => {
//     try {
//         const userBlogs = await Blog.find({
//             user: req.user._id
//         })
//         // console.log(userBlogs);
//         res.send(userBlogs)
//     } catch (error) {
        
//     }
// })

router.post("/blog/delete/:id", auth, async(req,res) => {
    try {
        const blog = await Blog.findOne({_id: req.params.id}).populate("user")
        if(!req.user.admin && req.user._id.toString() !== blog.user._id.toString()) throw new Error("You cannot perform this action.")
        await Blog.deleteOne({_id: req.params.id})   
        res.send({message: "Blog deleted successfully"})
    } catch (error) {
        res.send({
            error: error.path ? "Blog does not exist." : error.message 
        })
    }
})

router.patch("/blog/approve/:id", auth, async(req,res) => {
    try{
        const blog = await Blog.findById(req.params.id).populate("cohort");
        // check if auth is an admin user. if not send error
        if(!req.user.admin){
            throw new Error("You're not an admin! You cannot perform this action.")
        }

        let adminOfCohort = blog.cohort.admins.indexOf(req.user._id);
        if(adminOfCohort < 0) throw new Error("You're not an admin of this cohort! You cannot perform this action")

        if(!blog){
            throw new Error("Blog does not exist in the database.")
        }

        if(blog.approved){
            throw new Error("Blog already approved.")
        }

        blog.approved = true;
        await blog.save();

        res.send({message: "Approval success."})
    }catch(error){
        res.status(400).send({error: error.message})
    }
})

router.post("/blog/new", auth, async(req,res) => {
    try {
        // const {data} = await axios.get("https://medium.com/@reireynoso/drag-ndrop-with-react-beautiful-dnd-73014e5937f2")
        // const {data} = await axios.get("https://medium.com/@mandeep1012/function-declarations-vs-function-expressions-b43646042052#:~:text=The%20function%20statement%20declares%20a,must%20begin%20with%20%E2%80%9Cfunction%E2%80%9D.")  
        // const {data} = await axios.get("https://dev.to/reedbarger/how-to-fetch-data-in-react-cheatsheet-examples-3c4g") 
        // const {data} = await axios.get("https://dev.to/derekmt12/put-down-the-destructuring-hammer-3n7d")
        // const {data} = await axios.get("https://dev.to/abdullahsofiyu1/how-i-deal-with-imposter-syndromes-pg8")
        // const {data} = await axios.get("https://js.plainenglish.io/javascript-basics-call-bind-and-apply-f1e425026f88") 
        const {cohort, link, tags} = req.body
        // iterate through tags and make sure they are acceptable
        for(let i = 0; i < tags.length; i++){
            if(!acceptableTags[tags[i]]){
                throw new CustomError("tags", "Tags doesn't exist. How...?")
            }
        }
        // make sure cohort selected exist in the db
        // console.log(req.body.cohort);
        const foundCohort = await Cohort.findOne({name: cohort});
        if(!foundCohort) throw new CustomError("cohort", "Cohort doesn't exist. How...?")

        const {data} = await axios.get(link); 
        
        const $ = cheerio.load(data);
        // either something is returned from dev.to or medium
        let domain = $('meta[name="application-name"]').attr('content') || $('meta[property="og:site_name"]').attr('content')
        
        if(domain !== "dev.to" && domain !== "Medium"){
            throw new CustomError("link","Not a valid link. Please submit either a dev.to or Medium article.")
        }

        if(domain === "dev.to"){
            // to verify if dev.to article, look for specific tag
            let devtoBlogElementCheck = $('div.crayons-article__header__meta');
            if(!devtoBlogElementCheck.attr('class')){
                throw new CustomError("link", "Not a valid dev.to article link")
            }
        }

        if(domain === "Medium"){
            // to verify if medium article, look for specific tag
            let mediumBlogCheck = $('meta[name="parsely-post-id"]').attr('content')
            if(!mediumBlogCheck){
                throw new CustomError("link", "Not a valid Medium article link")
            }
        }

        // title search applies for both medium and dev.to
        const title = $('meta[property="og:title"]').attr('content');
        // console.log(title);
        // image path differs: dev.to structure | medium structure
        let image = $(`img[alt="Cover image for ${title}"]`).attr('src') || $('img[alt="Image for post"]').attr('src');
        if(image && domain === "Medium"){
            image = image.replace("60", "728");
        }
        // no image alternative link: https://www.dia.org/sites/default/files/No_Img_Avail.jpg
        // convert tags array values to object properties
        
        const tagsObj = {}
        for(let i = 0; i < tags.length; i++){
            if(!tagsObj[tags[i]]){
                tagsObj[tags[i]] = tags[i]
            }
        }
        // create the blog object
        const blogObj = {
            title,
            link,
            tags: tagsObj,
            user: req.user,
            image,
            cohort: foundCohort
        }

        const blog = new Blog(blogObj);
        await blog.save();
        res.send({blog})
    } catch (error) {   
        if(error.response){
            if(error.response.status === 404){
                error.message = "Not a valid link",
                error.type = "link"
            }
            // console.log(error.response.status)
        }
        // restructures axios error object
        if(error.code === "ECONNREFUSED"){
            error.message = "Not a valid link"
            error.type = "link"
        }

        if(error.code === 11000){
            error.message = "This link already exists in our records"
            error.type = "link"
        }

        const errorObject = {
            type: error.type || null, 
            message: error.message || "Something went wrong. Please try again later."
        }

        res.send({error: errorObject})   
    }
})

router.get("/initial-data", async(req,res) => {
    try {
        const cohorts = await Cohort.find({}).populate('admins'); 
        const blogs = await Blog.find({}).populate('user').populate('cohort');
        res.send({blogs,cohorts})
    } catch (error) {
        res.send({error})
    }
})


module.exports = router;