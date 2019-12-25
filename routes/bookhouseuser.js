const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  validatesocialuser,
  requireAuthentication,
  createSocialUser
} = require("../controllers/bookhouseusercontroller");
const { registerValidator } = require("../validators/bookhousevalidator");

router.post("/register", registerValidator, register);
router.post("/login", login);
router.get("/logout", logout);

router.post("/socialuser", createSocialUser);

module.exports = router;
