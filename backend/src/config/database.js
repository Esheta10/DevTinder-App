const mongoose = require("mongoose");

// Connect to mongoDB (replace with your connection string)
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://eshetajaiswal99_db_user:Esheta@cluster0.wcwdnmr.mongodb.net/devTinder");
}

module.exports = connectDB;

