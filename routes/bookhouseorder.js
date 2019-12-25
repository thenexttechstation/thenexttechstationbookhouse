const express = require("express");
const router = express.Router();
const {
  decreaseInventory
} = require("../controllers/bookhouseproductcontroller");

const {
  requireAuthentication,
  isAuth,
  isadministrator
} = require("../controllers/bookhouseusercontroller");
const {
  findProfileByUserId,
  addOrdersToUserHistory
} = require("../controllers/bookhouseuserprofilecontroller");
const {
  createOrder,
  listOrders,
  getOrderStatusValues,
  orderById,
  updateOrderStatus
} = require("../controllers/bookhouseordercontroller");

router.post(
  "/order/create/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  addOrdersToUserHistory,
  decreaseInventory,
  createOrder
);
router.put(
  "/order/:orderId/status/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  updateOrderStatus
);

router.get(
  "/order/orderstatus-values/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  getOrderStatusValues
);

router.get(
  "/order/list/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  listOrders
);

router.param("bookhouseuserId", findProfileByUserId);
router.param("orderId", orderById);

module.exports = router;
