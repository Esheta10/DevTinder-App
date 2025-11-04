const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) => {
    // Read the token from req cookies
    const {token} = req.cookies;

    try{
        const decodedObj = await jwt.verify(token,"DEV@TINDER$790",{expiresIn: "1d"});

        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user){
         throw new Error("User not found!");
        }
        req.user = user;
        next(); 
    }catch(err){
        res.status(404).send("ERROR: "+err.message);
    }

};

module.exports = {
    userAuth,
}

