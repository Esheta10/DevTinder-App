const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
// Populating data
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    if (connectionRequests) {
      return res.status(200).json({
        connectionRequests,
      });
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => row.fromUserId);

    res.status(200).json({
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Route: GET /feed
// Purpose: Fetch user profiles for the logged-in user's feed 
// (excluding their own, existing connections, ignored users, and pending requests)
// User should see all the user cards except
// 0. his own card
// 1. his connections
// 2. ignored people
// 3. already sent connection request
// Example: Michelle Obama, Barrack Obama, MS Dhoni, Melania Trump, Vladimir Putin

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // 🧠 Step 1: Get the currently logged-in user (injected by userAuth middleware)
    const loggedInUser = req.user;

    const page = parseInt(req.query.page || 1);
    let limit = parseInt(req.query.limit || 10);
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;

    // 🕵️ Step 2: Find all connection requests that involve the logged-in user
    // Either as the sender (fromUserId) or receiver (toUserId)
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ],
    }).select("fromUserId toUserId"); // Select only the user IDs, ignore other fields

    // 🧱 Step 3: Create a Set to store user IDs we want to hide from the feed
    const hideUsersFromFeed = new Set();

    // 🧩 Step 4: Loop through all connection requests and store both sides' IDs
    connectionRequest.forEach((req) => {
      // Defensive checks in case any field is missing
      if (req.fromUserId) hideUsersFromFeed.add(req.fromUserId.toString());
      if (req.toUserId) hideUsersFromFeed.add(req.toUserId.toString());
    });

    // 👀 Step 5: Find all users that should appear in the feed
    // Exclude:
    //  - All users from the hide list (connections, ignored, or pending)
    //  - The logged-in user themselves
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // not in hidden list
        { _id: { $ne: loggedInUser._id } },                // not the current user
      ],
    }).select(USER_SAFE_DATA)// only return safe fields (no password, etc.)
      .skip(skip)
      .limit(limit); 

    // ✅ Step 6: Send the filtered user list as response
    res.send(users);

  } catch (err) {
    // 🚨 Step 7: Handle any errors gracefully
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
