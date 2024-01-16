import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../models/user.js';
import catchAsync from '../utils/catchAsync.js';
import storeReturnTo from '../utils/storeReturnTo.js';

// * REGISTER NEW USER
router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
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
  })
);

// * LOGIN
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds/all';
    // delete req.locals.returnTo;
    res.redirect(redirectUrl);
  }
);

// * LOGOUT
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds/all');
  });
});

export default router;
