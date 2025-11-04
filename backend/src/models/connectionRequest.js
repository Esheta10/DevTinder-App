const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        validate: {
        validator: function (v) {
          return ["ignore", "interested", "accepted", "rejected"].includes(v);
        },
        message: (props) => `${props.value} is not a valid status type`,
      },
      },
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;