const express = require("express");
const requestRouter = express.Router();

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// 🔹 Test route (not protected) just to check if the endpoint works
requestRouter.post("/sendConnectionRequest", async (req, res) => {
  console.log("Sending a connection request!");
  res.send("Connection request endpoint hit!");
});

// 🔹 Protected route to send a connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    // 🧠 Extract sender (from user), receiver (to user), and status from request
    const fromUserId = req.user._id; // Comes from token via userAuth middleware
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // 🛑 Prevent users from sending connection requests to themselves
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ message: "You cannot send a connection request to yourself." });
    }

    // ✅ Allowed status types (must match your schema enum)
    const allowedStatus = ["ignore", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: " + status });
    }

    // 🔍 Check if a connection request already exists between these two users
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    // 🛑 If request already exists (either direction), don’t create a new one
    if (existingConnectionRequest) {
      return res.status(400).send({ message: "Connection request already exists!" });
    }

    // ✨ Create a new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    // 💾 Save the request in MongoDB
    const data = await connectionRequest.save();

    // 🎉 Send success response
    res.json({
      message: "Connection Request sent successfully!",
      data,
    });
  } catch (err) {
    // ⚠️ Catch and return any errors
    res.status(400).send("ERROR: " + err.message);
  }
});
// Post route for reviewing(accepting or rejecting) a connection request
// URL contains dynamic params: status and requestId
// userAuth - Middleware ensures that the user is authenticated  before handling request 
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        // Extract route parameters
        const {status, requestId} = req.params;

        // Allowed values for status  - only "accepted" or "rejected" are valid
        const allowedStatuses = ["accepted","rejected"];
        if(!allowedStatuses.includes(status)){
          return res.status(400).json({
            message: "Invalid Status or Status not allowed",
            success: false,
          });
        }
        // Find the specific coonection request
        // Conditions:
        // It must match the given requestId
        // It must be addressed to the logged-in user (toUserId)
        // It must certainly have status "interested" (meaning pending review)

        const connectionRequest = await ConnectionRequest.findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested",
        });
        
        // If no matching request found, return a 404
        if(!connectionRequest){
          return res.status(404).json({
            message : "Request not found",
            success: false,
          });
        }

        // Update the request staus to either accepted or rejected
        connectionRequest.status = status;

        // Save the updated request to DB
        const data = await connectionRequest.save();

        // Send success response
        res.status(200).json({
          message: "Connection request " + status,
          data,
          success: true,
        });
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});
module.exports = requestRouter;
