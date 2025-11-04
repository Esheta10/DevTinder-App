const express = require("express");
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser")

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // exact frontend URL
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB()
.then(() => {
    console.log("Database connection established");
    // start the server only after db connection is successful
    app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777.");
    });
})
.catch(err => {
    console.error("Database connection cannot be established");
})

