const mongoose = require("mongoose");
const Campground = require("../models/campground"); 
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers")

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true
})
.then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("FOUND A MISTAKE");
    console.log(err)})

// array[Math.floor(Math.random() * array.length)] // to peek a random element from an array 
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 250);
        const camp = new Campground({
            author: "63ad21ed40b25e8a1ecbc828",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: `http://source.unsplash.com/collection/483251`,
            description: "Lorem, ipsum dolor  sit amet consectetur adipisicing elit. Dolorem tempora saepe, error autem impedit veniam distinctio hic vitae doloremque, voluptatum dolore delectus aliquam ullam voluptatem non. Quia natus amet doloribus.",
            // price: price, shorter way is below
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dne6w2n77/image/upload/v1673742067/YelpCmap/ag0yemyzhrlvzbqruhno.jpg',
                  filename: 'YelpCmap/ag0yemyzhrlvzbqruhno',
                },
                {
                  url: 'https://res.cloudinary.com/dne6w2n77/image/upload/v1674106514/YelpCmap/nrzcyfguksipvrzjdjho.jpg',
                  filename: 'YelpCmap/fivrgrnnsebh0mblopma',
                }
              ],
            // geometry: { type: 'Point', coordinates: [ -77.792708, 24.698407500000002 ] },
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
        })
        await camp.save()
    }
}
// to close database connection :
seedDB().then(() => {
    mongoose.connection.close();
})