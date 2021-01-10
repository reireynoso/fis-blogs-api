const express = require('express');
const router = new express.Router();
const Cohort = require('../models/Cohort');
const auth = require('../middleware/auth');

// router.get("/cohort", async(_,res) => {

//     const cohorts = await Cohort.find({}).populate('admins'); // excludes the _id property

//     res.send(cohorts);
// })

// router.get("/cohort/admin", async(req,res) => {
//     const cohorts = await Cohort.find({}).select('-_id').populate('admins');
//     res.send(cohorts);
// })

router.post("/cohort/new", auth, async(req,res) => {
    // check if user is admin. if not, throw error
    // console.log(req.user);
    try {
        const cohort = new Cohort({
            name: req.body.name
        })
        cohort.admins.push(req.user._id)
        await cohort.save()
        res.status(201).send(cohort)
    } catch (error) {
        res.send({error})       
    }
})

module.exports = router;