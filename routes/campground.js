const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
// const { campgroundJoiSchema } = require("../joiSchemas.js");
// const ExpressError = require("../utils/ExpressError");
const {isLoggedIn, validateCampground, isAuthor} = require("../middleware")
const campgrounds = require("../controllers/campgrounds")
const {storage} = require('../cloudinary')

const multer = require('multer')
const upload = multer({storage})


// NEW CAMPGROUND
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})
router.post("/", isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.newCampground))
// router.post('/', upload.single('image'), (req, res) => {
//     console.log(req.file)
//     res.send("It worked")
// })
// ALL CAMPGROUNDS
router.get("/", catchAsync(campgrounds.index))

// INDIVIDUAL CAMPGROUND
router.get("/:id", catchAsync(campgrounds.individualCampground))

// Edit & Update
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.getEdit))
router.put("/:id", isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.putEdit))
 
// DELETE
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.delete)) 

module.exports = router