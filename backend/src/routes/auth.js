const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const {validateSignUpData} = require("../utils/validation")
const { userAuth } = require("../middlewares/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req,res) => {
 
    try {
        // Validation of data

        validateSignUpData(req);
        const {firstName,lastName,email,password,age,gender} = req.body;
        
       // Encrypt the password
       // const {password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);

        const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        age,
        gender,
    });

        await user.save();
        res.send("User added successfully!")
    } catch(err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
})

// Login route — authenticates user and issues a JWT cookie
authRouter.post("/login", async (req, res) => {
    try {
        // Extract email and password from the incoming request body
        const { email, password } = req.body;

        // Check if a user with this email exists in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credential"); // Email not registered
        }

        // Compare the plain-text password with the hashed password in DB
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
            // Generate a JWT token with user's ID and a 1-day expiry
            const token = await jwt.sign(
                { _id: user._id },
                "DEV@TINDER$790", // secret key (move this to .env in real apps)
                { expiresIn: "1d" }
            );
            console.log(token); // Debug log — shows token on server console

            // Store token in cookie so frontend can access it for authenticated requests
            res.cookie("token", token);

            // Send success response back to client
            res.send(user);
        } else {
            // If password doesn't match
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        // Handle any errors (wrong creds, DB issues, etc.)
        res.status(404).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async(req,res) => {
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
    res.send("Logged out");
})

module.exports = authRouter;

