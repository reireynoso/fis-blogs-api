const express = require('express');
const router = new express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const auth = require('../middleware/auth');
const CustomError = require('../custom-error/custom-error');
const acceptableTags = require('../data/tags');
const Cohort = require('../models/Cohort');
const Blog = require('../models/Blog');

router.get("/testing", (_,res) => {
    try {
        res.send("tested")
    } catch (error) {
        res.send("error")
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
        if(!req.user.admin) throw new Error("User is not an admin. You cannot perform this action.")
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
        const blog = await Blog.findById(req.params.id);
        // check if auth is an admin user. if not send error
        if(!req.user.admin){
            throw new Error("You're not an admin! You cannot perform this action.")
        }

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
        const title = $('meta[property="og:title"]').attr('content')
        if(!title){
            throw new CustomError("link","Not a valid Medium Link")
        }
        // find the post image. By default it returns with size 60. Replace is switching it with a higher resolution
        // default sample: https://miro.medium.com/max/60/some_image.png?q=20
        // console.log($('img[alt="Image for post"]').attr('src').replace("60", "6000"));
        let image = $('img[alt="Image for post"]').attr('src')
        if(image){
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
            message: error.message || "N/A"
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