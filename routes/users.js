const express = require("express")
const passport = require("passport")
const router = express.Router()

// const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")

const users = require("../controllers/users")

// ====== SIGN UP =======
router.route('/signup')
    .get(users.signupGet)
    .post(catchAsync(users.signupPost))

// ======== LOG IN =======
router.route('/login')
    .get(users.loginGet)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.loginPost)

// ========= LOGOUT ==========
router.get('/logout', users.logout)

module.exports = router