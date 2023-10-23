const mongoose = require('mongoose');

const connectDB = async function () {
    try {
        console.log("trying to connect to mongoDB...")
        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`MongoDB connected : ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        console.log("cannot connect to MongoDB");
    }
}

module.exports = connectDB;