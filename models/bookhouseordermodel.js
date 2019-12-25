const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const BookHouseCartItemSchema = new mongoose.Schema(
  {
    bookhouseproduct: { type: ObjectId, ref: "BookHouseProduct" },
    bookname: String,
    price: Number,
    imageurl: String,
    bookdescription: String,
    author: String,
    count: Number
  },
  { timestamps: true }
);

const BookHouseCartItem = mongoose.model(
  "BookHouseCartItem",
  BookHouseCartItemSchema
);

const BookHouseOrderSchema = new mongoose.Schema(
  {
    bookhouseproducts: [BookHouseCartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    updated: Date,
    bookhouseuser: { type: ObjectId, ref: "BookHouseUser" }
  },
  { timestamps: true }
);

const BookHouseOrder = mongoose.model("BookHouseOrder", BookHouseOrderSchema);

module.exports = { BookHouseOrder, BookHouseCartItem };
