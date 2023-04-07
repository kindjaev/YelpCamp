if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet")
const MongoStore = require('connect-mongo');

const campgroundRoutes = require("./routes/campground")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require('./routes/users')


const scriptSrcUrls = [
    'https://api.mapbox.com/',
    'https://cdn.jsdelivr.net/',
    'https://api.tiles.mapbox.com/',
    'https://cdnjs.cloudflare.com/',
    
]
const styleSrcUrls = [
    'https://api.mapbox.com/',
    'https://cdn.jsdelivr.net/',
    'https://api.tiles.mapbox.com/'
]
const connectSrcUrls = [
    'https://api.mapbox.com/',
    'https://a.tiles.mapbox.com/',
    'https://b.tiles.mapbox.com/',
    'https://events.mapbox.com/'
]
const fontSrcUrls = []

// const db_url = process.env.DB_URL
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp"

mongoose.connect(dbUrl, {
    //pass in our option that it doesn't yell at us
    useNewUrlParser: true
})
.then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("FOUND A MISTAKE");
    console.log(err)})

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //helps to extract info from req.body
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public'))) //serve our public directory 

const secret = process.env.SECRET || "secretcodeshouldbehere"
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600
})
store.on('Error', (err) => {
    console.log("Store session error: ", err)
})
const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
        httpOnly: true,
        // secure: true, //use it only in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use( helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        connectSrc: ["'self'", ...connectSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        fontSrc: ["'self'", ...fontSrcUrls],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://images.unsplash.com/",
            "https://res.cloudinary.com/"
        ]
    }
}))


app.use(passport.initialize())
app.use(passport.session())

app.use(mongoSanitize())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(req.query)

    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

// USERS ROUTES
app.use("/", userRoutes)

// ********** CAMPGROUNDS ROUTES ***********
app.use('/campgrounds', campgroundRoutes)

// ********** REVIEWS ROUTES ***********
app.use("/campgrounds", reviewRoutes)

// HOME PAGE
app.get("/", (req,res) => {
    res.render("home.ejs")
})

// for every single request app.all / for every single path "*"
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

// Error Handler:
app.use((err, req, res, next) => {
    const {status = 500} = err;
    if (!err.message) err.message  = "Something Went Wong"
    // res.status(status).send(message)
    res.status(status).render("error.ejs", { err })
    res.send("Something went wrong") 
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})