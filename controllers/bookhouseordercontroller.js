const {
  BookHouseOrder,
  BookHouseCartItem
} = require("../models/bookhouseordermodel");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

exports.orderById = (req, res, next, id) => {
  BookHouseOrder.findById(id)
    .populate("bookhouseproducts.bookhouseproduct", "bookname price imageurl")
    .exec((err, bookhouseorder) => {
      if (err || !bookhouseorder) {
        return res.status(400).json({
          error: err
        });
      }
      req.bookhouseorder = bookhouseorder;
      next();
    });
};

exports.updateOrderStatus = (req, res) => {
  BookHouseOrder.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, bookhouseorder) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(bookhouseorder);
    }
  );
};

exports.createOrder = (req, res) => {
  console.log("Here there" + JSON.stringify(req.body.order));

  // console.log("CREATE ORDER: ", req.body);
  //req.body.order.user = req.profile;
  const order = new BookHouseOrder(req.body.order);
  console.log("Here" + JSON.stringify(order));

  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    const emailData = {
      to: "thenexttechstation@gmail.com",
      from: "noreply@ecommerce.com",
      subject: `A new order is received`,
      html: `
      <p>Customer name:</p>
      <p>Total products:</p>
      <p>Total cost:</p>
      <p>Login to dashboard to the order in detail.</p>
  `
    };
    sgMail.send(emailData);
    res.json(data);
  });
};

exports.getOrderStatusValues = (req, res) => {
  res.json(BookHouseOrder.schema.path("status").enumValues);
};

exports.listOrders = (req, res) => {
  BookHouseOrder.find()
    .populate("bookhouseuser", "_id username email")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }
      res.json(orders);
    });
};
