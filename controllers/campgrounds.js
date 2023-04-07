const Campground = require("../models/campground");
const cloudinary = require('cloudinary')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapboxToken})

// ALL CAMPGROUNDS
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    // console.log(campgrounds[0].images[0].url)
    res.render("campgrounds/index", { campgrounds });
}

//NEW CAMPGROUND
module.exports.newCampground = async (req, res, next) => {
    // res.send(req.body)
    // we need to parse req.body by app.use(express.urlencoded({ extended: true }));
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // res.send(geoData)
    // console.log(geoData)
    const newCamp = new Campground(req.body.campground); // as we group things in new.ejs under campground we should extract 
    newCamp.geometry = geoData.body.features[0].geometry
    newCamp.images = req.files.map(img => (
        {url: img.path, filename: img.filename}
    ))
    newCamp.author = req.user._id
    // data from req.body.campground
    await newCamp.save();
    // console.log(newCamp)
    req.flash("success", "Successfully made a new campground!") 
    res.redirect(`/campgrounds/${newCamp._id}`);
}

// INDIVIDUAL CAMPGROUND 
module.exports.individualCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground
        .findById(id)
        .populate({path: 'reviews', populate: {path: 'author'}})
        .populate('author'); 
    console.log(campground);
    if (!campground){
        req.flash("error", "Cannot find the page!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground })
}

// EDIT
module.exports.getEdit = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id);
    if (!campground){
        req.flash("error", "Cannot find the page!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}

module.exports.putEdit = async (req, res, next) => {
    const {id} = req.params
 
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true, new: true});
    const imgs = req.files.map(img => (
        {url: img.path, filename: img.filename}
    ))
    camp.images.push(...imgs)
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    await camp.save()
    // instead of req.body.campground we can write {...req.body.campground}
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${camp._id}`);
}

// DELETE
module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campgroud!")
    res.redirect("/campgrounds");
}


module.exports
module.exports