const express = require('express');
const router = new express.Router();
const Cohort = require('../models/Cohort');
const auth = require('../middleware/auth');
const User = require('../models/User');

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
    try {
        const newCohort = new Cohort({
            name: req.body.name.toUpperCase()
        })
        newCohort.admins.push(req.user._id)
        await newCohort.save()

        const cohort = await Cohort.findOne({_id: newCohort._id}).populate("admins");

        res.status(201).send(cohort)
    } catch (error) {
        res.send({error})       
    }
})

router.patch("/cohort/:id", auth, async(req,res) => {
    const cohort = await Cohort.findById(req.params.id);

    try{
        if(!cohort) throw new Error("Cohort does not exist");

        const {action, userId} = req.body;

        if(!userId) throw new Error("No admin user provided");

        if(action !== "remove" && action !=="add" && !action) throw new Error("Not a valid action");

        if(action === "remove"){
            const removedUser = cohort.admins.filter(admin => admin.toString() !== userId);
            if(removedUser.length === cohort.admins.length) throw new Error("Cannot user as admin as they were never an admin for this cohort.")
            cohort.admins = removedUser
        }
        
        if(action === "add"){
            // do something
            const alreadyAdmin = cohort.admins.some(admin => admin.toString() === userId)
            if(alreadyAdmin) throw new Error("User is already an admin for this cohort")
            const newlyAppointedAdmin = await User.findById(userId);
            cohort.admins.push(newlyAppointedAdmin);
        }

        // save changes
        await cohort.save();
        res.status(200).send()
    }
    catch(error){
        res.status(401).send({error: error.message})
    }
})

module.exports = router;