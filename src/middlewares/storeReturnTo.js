/**
 * Middleware that saves returnTo value from the
 * session (req.session.returnTo) to res.locals
 */

function storeReturnTo (req, res, next) {
  console.log(req.session); // TODO: Remove console.log
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

export default storeReturnTo;