const Review = require("../models/review");
const Campground = require("../models/campground");

// CREATE REVIEW
module.exports.createReview = async (req, res, next) => {
    // res.send("you made");
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save(); 
    await campground.save();
    req.flash("success", "Created new review!")
    res.redirect(`/campgrounds/${campground._id}`);
}

// DELETE REVIEW
module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`);
}
