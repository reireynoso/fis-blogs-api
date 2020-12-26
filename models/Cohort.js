const mongoose = require('mongoose');

const cohortSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

cohortSchema.post('save', function(error, doc, next) {
    //handles errors when attempting to save a cohort instance upon creation
    let errors = "";
    if(error.name === "MongoError" && error.code === 11000){
        errors = ("Cohort name already exists.")
    }
    else if(error.name === "ValidationError"){
        errors = ("Cohort name cannot be blank.")
    }
    else{
        errors = ('There was an error.')
    }
    next(errors)    
});

const Cohort = mongoose.model('Cohort', cohortSchema);

module.exports = Cohort