const express = require("express");
const profileRouter = express.Router();

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")
const jwt = require("jsonwebtoken")

profileRouter.get("/profile", userAuth, async(req,res) => {

    const cookies = req.cookies;
    console.log(cookies);


    const {token} = cookies;
    // Validate my token
    const decodedMessage = await jwt.verify(token,"DEV@TINDER$790");
    const {_id,firstName,lastName,email,password,age,gender} = decodedMessage;

    console.log("Logged in user is: " + _id);
     const user = req.user;
    res.send(user);

});

profileRouter.get("/profile/view", userAuth, async(req,res) => {

    try{
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully.`,
            data: loggedInUser
        })
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});
module.exports = profileRouter;

