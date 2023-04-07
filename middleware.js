const Campground = require("./models/campground");
const Review = require("./models/review")
const { campgroundJoiSchema, reviewJoiSchema } = require("./joiSchemas.js");
const ExpressError = require("./utils/ExpressError");


// Authentication middleware
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error", "Authentication required!")
        return res.redirect('/login')
    }
    next()
}

// joi validation middleware :
module.exports.validateCampground = (req, res, next) => {
    const result = campgroundJoiSchema.validate(req.body); //pass our schema throuh 
    // console.log(result);
    if (result.error){
        const msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
} 

// Author Middleware
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

// review Author middleware
module.exports.isReviewAuth = async (req, res, next) => {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

// joi validation middleware for review: 
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}