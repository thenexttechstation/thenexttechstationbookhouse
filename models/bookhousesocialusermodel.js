const mongoose = require("mongoose");

const bookhouseuserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    display: {
      type: String,
      required: true
    },
    userinfo: {
      type: String,
      trim: true
    },
    salt: String,
    userrole: {
      type: Number,
      default: 0
    },
    audit: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);
