const express = require("express")
const router = express.Router() // {mergeParams: true} - we could use it to send params in different files 

const catchAsync = require("../utils/catchAsync");
// const { reviewJoiSchema } = require("../joiSchemas.js");
// const ExpressError = require("../utils/ExpressError");

// const Campground = require("../models/campground");
// const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuth} = require("../middleware.js")
const reviews = require("../controllers/reviews")

// Create Reviews:
router.post("/:id/reviews", isLoggedIn, validateReview, catchAsync(reviews.createReview))

// Delete Review :
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuth, catchAsync(reviews.deleteReview))

module.exports = router