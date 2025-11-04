const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName)
        throw new Error("Enter a valid first or last name");
    else if(!validator.isEmail(email))
        throw new Error("Enter a valid email-id");
    else if(!validator.isStrongPassword(password))
        throw new Error("Enter a valid password");
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName","lastName","age","gender","email","skills","about"];

   return  Object.keys(req.body).every((field) => allowedEditFields.includes(field))
}
module.exports = {
    validateSignUpData,
    validateEditProfileData
}