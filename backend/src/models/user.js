const mongoose = require("mongoose");
const validator = require("validator");
// Define the User Schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:1,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength:1 ,
        maxLength: 50
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        trim:true,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: ['Male','Female','Other'],
        message: `{VALUE} is not a valid gender type`
        // validate(value){
        //     if(!["Male","Female","Others"].includes(value)){
        //         throw new Error("Not a valid gender.");
        //     }
        },
    photoURL: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.mauicardiovascularsymposium.com%2Fjohn-b-gordon-md-facc%2Fdummy-profile-pic-300x300%2F&psig=AOvVaw0q1BHF79oagWDiePx3KMX_&ust=1761739727250000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLiDoYnuxpADFQAAAAAdAAAAABAE",
    },
    about: {
        type: String,
        default: "This is a default about section of the user.",
    },
    skills: {
        type: [String],
    },
   
},
    {
        timestamps: true,
    }
);

// Schema.methods
// for jwt
userSchema.methods.getjwt = async function(){
    const user = this;
    const token = await jwt.sign({_id:this._id},"DEV@TINDER$790",{expiresIn : "1d"});

    return token;
}

// for password Validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isValidPassword = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isValidPassword;
}


// Create a User model from the Schema
const User = mongoose.model("User",userSchema);
module.exports = User;


