const express = require("express");
const thenexttechbookstationapp = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
// database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

//import routes
const bookhouseuserRoutes = require("./routes/bookhouseuser");
const bookhouseuserProfileRoutes = require("./routes/bookhouseuserprofile");
const bookhouseCategoryRoutes = require("./routes/bookhousecategory");
const bookhouseProductRoutes = require("./routes/bookhouseproduct");
const bookhouseBraintreeRoutes = require("./routes/braintreepayment");
const bookhouseOrderRoutes = require("./routes/bookhouseorder");

//middlewares
thenexttechbookstationapp.use(morgan("dev"));
thenexttechbookstationapp.use(bodyParser.json());
thenexttechbookstationapp.use(cookieParser());
thenexttechbookstationapp.use(expressValidator());
thenexttechbookstationapp.use(cors());

//routes middleware

thenexttechbookstationapp.use("/bookhouseapi", bookhouseuserRoutes);
thenexttechbookstationapp.use("/bookhouseapi", bookhouseuserProfileRoutes);
thenexttechbookstationapp.use("/bookhouseapi", bookhouseCategoryRoutes);
thenexttechbookstationapp.use("/bookhouseapi", bookhouseProductRoutes);
thenexttechbookstationapp.use("/bookhouseapi", bookhouseBraintreeRoutes);
thenexttechbookstationapp.use("/bookhouseapi", bookhouseOrderRoutes);

const port = process.env.PORT || 8000;

thenexttechbookstationapp.listen(port, () => {
  console.log("Server is running on port" + port);
});
