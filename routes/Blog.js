const express = require('express');
const router = new express.Router();

router.get("/testing", (req,res) => {
    try {
        res.send("tested")
    } catch (error) {
        res.send("error")
    }
})

module.exports = router;