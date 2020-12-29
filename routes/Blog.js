const express = require('express');
const router = new express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get("/testing", (req,res) => {
    try {
        res.send("tested")
    } catch (error) {
        res.send("error")
    }
})

router.get("/blog/new", async(req,res) => {
    const {data} = await axios.get("https://medium.com/@reireynoso/drag-ndrop-with-react-beautiful-dnd-73014e5937f2") 
    const $ = cheerio.load(data);
    // find the post image. By default it returns with size 60. Replace is switching it with a higher resolution
    // default sample: https://miro.medium.com/max/60/some_image.png?q=20
    // console.log($('img[alt="Image for post"]').attr('src').replace("60", "6000"));
    const image = $('img[alt="Image for post"]').attr('src').replace("60", "728");
    const title = $('meta[property="og:title"]').attr('content')
    console.log(title)
    res.send({image})
})


module.exports = router;