const BookHouseUser = require("../models/bookhouserusermodel");

const {
  BookHouseOrder,
  BookHouseCartItem
} = require("../models/bookhouseordermodel");
exports.findProfileByUserId = (request, response, next, id) => {
  BookHouseUser.findById(id).exec((error, bookhouseuser) => {
    if (error || !bookhouseuser) {
      return response.status(400).json({
        error: "No Userdd"
      });
    }
    request.profile = bookhouseuser;
    next();
  });
};

exports.purchaseBookHistory = (req, res) => {
  console.log("inside purchase" + req.profile._id);
  BookHouseOrder.find({ bookhouseuser: req.profile._id })
    .populate("bookhouseuser", "_id username")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(orders);
    });
};

exports.addOrdersToUserHistory = (request, response, next) => {
  console.log(
    "iNSIDE addOrderstouser" + request.body.order.bookhouseproducts.price
  );

  let bookhistory = [];
  request.body.order.bookhouseproducts.forEach(item => {
    bookhistory.push({
      _id: item._id,
      bookname: item.bookname,
      bookdescription: item.bookdescription,
      bookhousecategory: item.bookhousecategory,
      author: item.author,
      price: item.price,
      quantity: item.count,
      transaction_id: request.body.order.transaction_id,
      amount: request.body.order.amount
    });
  });
  BookHouseUser.findOneAndUpdate(
    { _id: request.profile._id },
    { $push: { history: bookhistory } },
    { new: true },
    (error, data) => {
      if (error) {
        console.log("error" + error);
        return response.status(400).json({
          error: "Error in update in User purchase history"
        });
      }
      next();
    }
  );
};

exports.getsingleUser = (request, response) => {
  return response.json(request.profile);
};

exports.updateUser = (request, response) => {
  BookHouseUser.findOneAndUpdate(
    { _id: request.profile._id },
    { $set: request.body },
    { new: true },
    (error, updateduser) => {
      if (error) {
        return response.status(400).json({
          error: "Error in updation"
        });
      }
      //updateduser.password_hashed = undefined;
      //updateduser.salt = undefined;
      response.json(updateduser);
    }
  );
};
