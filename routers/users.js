const express = require(`express`);
const router = express.Router();
const catchAsync = require(`../utilities/catchAsync`);
const User = require(`../Models/user`);
const passport = require("passport");
const users = require(`../controllers/users`);
const user = require("../Models/user");

router
  .route(`/register`)
  .get(users.registerUser)
  .post(catchAsync(users.successfullyRegisterUser));

router
  .route(`/login`)
  .get(users.loginUser)
  .post(
    passport.authenticate(`local`, {
      failureFlash: true,
      failureRedirect: `/login`,
    }),
    users.welcomebackUser
  );
router.get(`/logout`, users.logoutUser);
module.exports = router;
