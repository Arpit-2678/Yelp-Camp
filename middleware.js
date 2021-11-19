const express = require(`express`);
const { campgroundSchema } = require(`./schema`);
const Campground = require(`./Models/campground`);
const ExpressError = require(`./utilities/expressErrors`);

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;

// module.exports = validateCampground;
// module.exports = isAuthor;
