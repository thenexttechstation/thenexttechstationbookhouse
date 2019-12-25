const express = require("express");
const router = express.Router();

const {
  requireAuthentication,
  isAuth
} = require("../controllers/bookhouseusercontroller");
const {
  findProfileByUserId
} = require("../controllers/bookhouseuserprofilecontroller");
const {
  generateBraintreeToken,
  processPayment
} = require("../controllers/braintreepaymentcontroller");

router.get(
  "/braintree/getToken/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  generateBraintreeToken
);

router.post(
  "/braintree/payment/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  processPayment
);

router.param("bookhouseuserId", findProfileByUserId);

module.exports = router;
