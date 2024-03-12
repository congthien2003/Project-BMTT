const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController.js");

router.use("/login", siteController.login);
router.use("/register/userstore", siteController.userStoreWithHash);
router.use("/register", siteController.register);
router.use("/", siteController.index);

module.exports = router;
