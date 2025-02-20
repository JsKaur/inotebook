const mongoose = require('mongoose');


const mongoURI="mongodb://localhost:27017/inotebook";


const connectToMongo = async() => {

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit the process if connection fails
    }
}

module.exports=connectToMongo;