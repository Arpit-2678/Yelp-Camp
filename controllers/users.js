const User = require(`../Models/user`);

module.exports.registerUser = (req, res) => {
  res.render(`Users/register`);
};

module.exports.successfullyRegisterUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.loginUser = (req, res) => {
  res.render(`Users/login`);
};

module.exports.welcomebackUser = (req, res) => {
  req.flash(`success`, `Welcome Back`);
  const redirectURL = req.session.returnTo || `/campgrounds`;
  res.redirect(redirectURL);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash(`success`, `Goodbye!!`);
  res.redirect(`/`);
};
