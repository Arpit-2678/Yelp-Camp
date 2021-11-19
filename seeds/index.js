const mongoose = require(`mongoose`);
const Campground = require(`../Models/campground`);
const cities = require(`./cities`);
const { places, descriptors } = require(`./seedHelper`);

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});

const db = mongoose.connection;
db.on(`error`, console.error.bind(console, `error in connection`));
db.once("open", () => {
  console.log(`Databse Connected`);
});

const randomIndex = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 1; i <= 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 50);
    const camp = new Campground({
      author: `619570cc52f1e7d07fc6603d`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${randomIndex(descriptors)} ${randomIndex(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637318770/YelpCamp/vtasfckqwhyg3uwfgdpb.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637318770/YelpCamp/n6vjtyvyb4jxwi3f0hsi.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637318770/YelpCamp/nympro9372edeygy2wny.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637318770/YelpCamp/gm3eiy8elofpxjd4ekrg.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637318770/YelpCamp/xemwoi8zde7ose9mbqyg.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637318770/YelpCamp/uerw57o68m20nqt34uxd.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637307747/YelpCamp/ayhjs8zq6xfhr1ch5jpb.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
        {
          url: "https://res.cloudinary.com/ajcloudinary/image/upload/v1637260510/YelpCamp/wakufn6m2ro6jehbpzbh.jpg",
          filename: "YelpCamp/kyupvbogdhqxf9qmrbzu",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, possimus? Architecto id in sint nostrum dolore dolores culpa cupiditate, quos quaerat ratione consequuntur ipsum sapiente vero fugiat reiciendis, nemo cum.`,
      price,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
