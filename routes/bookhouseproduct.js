const express = require("express");
const router = express.Router();
const {
  requireAuthentication,
  isAuth,
  isadministrator
} = require("../controllers/bookhouseusercontroller");
const {
  createProduct,
  findProductById,
  getsingleProduct,
  removeProduct,
  updateProduct,
  fetchAllProductDetails,
  fetchAllRelatedProductDetails,
  findCategoriesToProduct,
  ProductSearch,
  loadProductImage,
  listSearch,
  listAuthorSearch
} = require("../controllers/bookhouseproductcontroller");
const {
  findProfileByUserId
} = require("../controllers/bookhouseuserprofilecontroller");

router.get("/product/:bookhouseproductId", getsingleProduct);
router.post(
  "/product/create/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  createProduct
);
router.delete(
  "/product/remove/:bookhouseproductId/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  removeProduct
);
router.put(
  "/product/update/:bookhouseproductId/:bookhouseuserId",
  requireAuthentication,
  isAuth,
  isadministrator,
  updateProduct
);

router.get("/products", fetchAllProductDetails);
router.get(
  "/relatedproducts/:bookhouseproductId",
  fetchAllRelatedProductDetails
);
router.get("/categoriestoproduct", findCategoriesToProduct);
router.get("/products/search", listSearch);
router.get("/products/authorsearch", listAuthorSearch);

router.post("/products/by/search", ProductSearch);
router.get("/product/image/:bookhouseproductId", loadProductImage);

router.param("bookhouseuserId", findProfileByUserId);
router.param("bookhouseproductId", findProductById);

module.exports = router;
