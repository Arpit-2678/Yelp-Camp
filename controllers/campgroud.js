const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "YelpCamp",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const Campground = require(`../Models/campground`);
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const camp = await Campground.find({});
  res.render(`campgrounds/index`, { camp });
};

module.exports.renderNewForm = (req, res) => {
  res.render(`campgrounds/new`);
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  // console.log(geoData.body.features[0].geometry.coordinates);
  if (!req.body.campground)
    throw new ExpressError(`Invalid Campground Data`, 400);
  const newCampground = await new Campground(req.body.campground);
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.author = req.user._id;
  await newCampground.save();
  // console.log(newCampground);
  req.flash(`success`, `Successfully added a new campground`);
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampgroundDetails = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: `reviews`, populate: { path: `author` } })
    .populate(`author`);
  // console.log(campground);
  if (!campground) {
    req.flash(`error`, `Cannot find the campground!!`);
    return res.redirect(`/campgrounds`);
  }
  res.render(`campgrounds/show`, { campground });
};

module.exports.editCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash(`error`, `Cannot find the campground!!`);
    return res.redirect(`/campgrounds`);
  }
  res.render(`campgrounds/edit`, { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash(`success`, `Successfully updated the campground`);
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash(`success`, `Successfully deleted campground`);
  res.redirect(`/campgrounds`);
};
