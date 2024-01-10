/**
 * ExpressError
 * I can throw ExpressError to catch errors that wont't be
 * automatically detected by node, like creating an empty
 * campground. It will pass to next and reach app.use at the
 * bottom.
 */

class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default ExpressError;
