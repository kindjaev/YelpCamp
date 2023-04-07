const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const {Schema} = mongoose

const UserSchema = new Schema({
    email: {
        required: true,
        type: String,
        unique: true,
    },
    // password: {
    //     required: true,
    //     type: String
    // }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)