const express = require('express');
const router = new express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const auth = require('../middleware/auth');
const CustomError = require('../custom-error/custom-error');
const tags = require('../data/tags');
const Cohort = require('../models/Cohort');

router.get("/testing", (req,res) => {
    try {
        res.send("tested")
    } catch (error) {
        res.send("error")
    }
})

router.post("/blog/new", auth, async(req,res) => {
    try {
        // const {data} = await axios.get("https://medium.com/@reireynoso/drag-ndrop-with-react-beautiful-dnd-73014e5937f2")
        // const {data} = await axios.get("https://medium.com/@mandeep1012/function-declarations-vs-function-expressions-b43646042052#:~:text=The%20function%20statement%20declares%20a,must%20begin%20with%20%E2%80%9Cfunction%E2%80%9D.") 

        // iterate through tags and make sure they are acceptable
        for(let i = 0; i < req.body.tags.length; i++){
            if(!tags[req.body.tags[i]]){
                throw new CustomError("tags", "Tags doesn't exist. How...?")
            }
        }
        // make sure cohort selected exist in the db
        // console.log(req.body.cohort);
        const foundCohort = await Cohort.findOne({name: req.body.cohort});
        if(!foundCohort) throw new CustomError("cohort", "Cohort doesn't exist. How...?")

        const {data} = await axios.get(req.body.link); 
        
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
        res.send({image})
    } catch (error) {   
        // restructures axios error object
        if(error.code === "ECONNREFUSED"){
            error.message = "Not a valid link"
            error.type = "link"
        }

        const errorObject = {
            type: error.type || null, 
            message: error.message || "N/A"
        }

        res.send({error: errorObject})   
    }
})


module.exports = router;