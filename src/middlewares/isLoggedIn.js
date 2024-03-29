function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    // req.session.returnTo = req.originalUrl;
    req.flash('error', 'you must be signed in');
    return res.redirect('/users/login');
  }
  next();
}

export default isLoggedIn;
