const mongoose = require("mongoose");

const bookhousecategorySchema = new mongoose.Schema(
  {
    categoryname: {
      type: String,
      trim: true,
      maxlength: 20,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookHouseCategory", bookhousecategorySchema);
