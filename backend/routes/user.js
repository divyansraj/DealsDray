const express = require('express');
const { signUp, logIn, logout, getDetails } = require("../controllers/user");
const router = express.Router();

router.route("/user/signUp").post(signUp);
router.route("/user/logIn").post(logIn);
router.route('/user/logout').post(logout)
router.route("/user/details").post(getDetails);

module.exports = router;