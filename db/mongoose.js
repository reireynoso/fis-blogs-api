const mongoose = require('mongoose');
const connectDB = async() => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connected: ${(await conn).Connection.host}`);
    }catch(error){
        console.error(e);
        process.exit(1)
    }
}

module.exports = connectDB;