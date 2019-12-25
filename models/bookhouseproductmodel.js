const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bookhouseproductSchema = new mongoose.Schema(
  {
    bookname: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true
    },
    bookdescription: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    author: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true
    },
    price: {
      type: Number,
      trim: true,
      required: true
    },
    imageurl: {
      type: String
    },
    bookhousecategory: {
      type: ObjectId,
      ref: "BookHouseCategory",
      maxlength: 50,
      required: true
    },
    quantity: {
      type: Number
    },
    mostPurchased: {
      type: Number,
      default: 0
    },
    image: {
      data: Buffer,
      contentType: String
    },
    deliverable: {
      required: false,
      type: Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookHouseProduct", bookhouseproductSchema);
