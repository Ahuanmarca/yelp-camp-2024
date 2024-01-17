import User from '../models/User.js';

const registerUserForm = (req, res) => {
  res.render('users/register');
};

const createUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds/all');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('register');
  }
};

const loginUserForm = (req, res) => {
  res.render('users/login');
};

const loginUserFlashRedirect = (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = res.locals.returnTo || '/campgrounds/all';
  // delete req.locals.returnTo;
  res.redirect(redirectUrl);
};

const logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds/all');
  });
};

export {
  registerUserForm,
  createUser,
  loginUserForm,
  loginUserFlashRedirect,
  logoutUser,
};
