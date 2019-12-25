const express = require("express");
const router = express.Router();
const {
  requireAuthentication,
  isAuth,
  isadministrator
} = require("../controllers/bookhouseusercontroller");
const {
  createCategory,
  findCategoryById,
  getsingleCategory,
  updateCategory,
  removeCategory,
  fetchAllCategoryDetails
} = require("../controllers/bookhousecategorycontroller");
const {
  findProfileByUserId
} = require("../controllers/bookhouseuserprofilecontroller");
router.post(
  "/category/create/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  createCategory
);
router.put(
  "/category/update/:bookhousecategoryId/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  updateCategory
);
router.delete(
  "/category/remove/:bookhousecategoryId/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  removeCategory
);
router.get("/category/all", fetchAllCategoryDetails);

router.get("/category/:bookhousecategoryId", getsingleCategory);
router.param("bookhouseuserId", findProfileByUserId);
router.param("bookhousecategoryId", findCategoryById);

module.exports = router;
