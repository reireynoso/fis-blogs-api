const mongoose = require('mongoose');
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.NODE_ENV === "production" ? process.env.MONGODB_URL : 'mongodb://127.0.0.1:27017/codingBlogs-api', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        // console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(error){
        console.error(error);
        process.exit(1)
    }
}

module.exports = connectDB;