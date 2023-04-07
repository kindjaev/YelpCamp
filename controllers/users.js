const User = require("../models/user")

// SIGN UP
module.exports.signupGet = (req, res) => {
    res.render("users/signup")
}
module.exports.signupPost = async (req, res, next) => {
    try {
        const {email, password, username} = req.body.user
        // res.send(req.body.user)
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next(err)
            req.flash("success", "Successfully signed up!") 
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', 'Username or Email already exist!')
        res.redirect('/signup')
    }
}
// LOGIN
module.exports.loginGet = (req, res) => {
    res.render('users/login')
}
module.exports.loginPost = async (req, res) => {
    req.flash("success", "Logged in")
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

// LOGOUT
module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
    if (err) { return next(err) }
    req.flash("success", "You logged out!")
    res.redirect('/');
  })
}