# YelpCamp

Web App created with **Node.js** and **MongoDB** for Colt Steele's "The Web Developer Bootcamp 2024".

## Routes

| PATH                               | VERB   | PURPOSE                           |
| ---------------------------------- | ------ | --------------------------------- |
| /                                  | GET    | Homepage                          |
| /campgrounds/all                   | GET    | Display all campgrounds           |
| /campgrounds/:id/show              | GET    | Show details for one campground   |
| /campgrounds/:id/edit              | GET    | Form to edit one campground       |
| /campgrounds/:id/edit              | PUT    | (Endpoint) to edit one campground |
| /campgrounds/:id/delete            | DELETE | Deletes one campground            |
| /campgrounds/new                   | GET    | Form to create new campground     |
| /campgrounds/new                   | POST   | (Endpoint) Creates new campground |
| /campgrounds/:id/reviews/new       | POST   | (Endpoint) Creates new review     |
| /campgrounds/:id/reviews/:reviewId | DELETE | (Endpoint) Deletes a review       |
| /users/register                    | GET    | Form to register new user         |
| /users/login                       | POST   | (Endpoint) Logins the user        |

## Error Handling / Form Validation

Not using try/catch blocks, but instead...

- catchAsync function is defined in separate file. It's a higher order function that expects the route's async function as it's argument, then returns a function with next.

```js
// catchAsync.js
function catchAsync(asyncFunc) {
  return (req, res, next) => {
    asyncFunc(req, res, next).catch(next);
  };
}

export default catchAsync;
```

- Routes don't have "(req, res, next)" signature. Instead, routes' functions are "wrapped" in the catchAsync funtion. Not a middleware strictly speaking? Example:

```js
app.get(
  '/campgrounds/all',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);
```

- At the bottom of app.js we have an app.use that catches all errors passed to next() in the routes // For now there is no next() in the routes, only in the catchAsync middleware.

- We are using an error.ejs template to show errors in a more friendly way.

### (Backend) Form validations with Joi

Using **joi** package for form validations. Some errors will be thrown by node, others are thrown by **Joi** form validations. We can also manually throw ExpressError.

```js
// joiValidations.js
import Joi from 'joi';
import ExpressError from './ExpressError.js';

const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

function validateCampground(req, res, next) {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

//...

export { validateCampground, validateReview };
```

`Joi` usage:

```js
// campgrounds.router.js
router.post(
  '/new',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    console.log(req);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}/show`);
  })
);
```

### (Frontend) From validations with Bootstrap

For the client side form validation we are using Bootstrap.

- Make 'public' directory available on the ejs templates

```js
// index.js
// Make the 'public' directory available on the ejs templates
  app.use(express.static(path.join(__dirname, 'public')));
```

- Now on the bottom of out ejs main layout we can get a script from the public directory.

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

<!-- Bootstrap Form Validations -->
<script src="/scripts/validateForms.js"></script>
```

- Bootstrap form validations script. This script is copy/pasted from the Bootstrap page. It makes form validations work. We hava to add some classes to our forms.

```js
// Example starter JavaScript for disabling form submissions if there are invalid fields
// https://getbootstrap.com/docs/5.3/forms/validation/
(() => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false
    );
  });
})();
```

- Form example with Bootstrap form validations

```html
<%- include('../layout/top') %>
  <div class="row">
    <h1 class="text-center">New Campground</h1>
    <div class="col-6 offset-3">
      <form action="/campgrounds/new" method="POST" class="needs-validation" novalidate>
        <div class="mb-3">
          <label class="form-label" for="title">Title</label>
          <input class="form-control" type="text" id="title" name="campground[title]" required>
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please provide a title.</div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="location">Location</label>
          <input class="form-control" type="text" id="location" name="campground[location]" required>
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please provide a location.</div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="image">Image Url</label>
          <input class="form-control" type="text" id="image" name="campground[image]">
        </div>
        <div class="mb-3">
          <label class="form-label" for="price">Campground Price</label>
          <div class="input-group">
              <span class="input-group-text" id="price-label">$</span>
              <input type="text" class="form-control" id="price" placeholder="0.00" aria-label="price"
                  aria-describedby="price-label" name="campground[price]" required>
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Please provide a price.</div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="description">Description</label>
          <textarea class="form-control" type="text" id="description" name="campground[description]" required></textarea>
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please provide a description.</div>
        </div>
        <div class="mb-3">
          <button class="btn btn-success">Add Campground</button>
        </div>
      </form>
      <a href="/campgrounds/all">All Campgrounds</a>
    </div>
  </div>
  <%- include('../layout/bottom') %>

```

## Session and Flash Messages (Alerts)

To make flash alerts, we need to install npm packages "express-session" and "connect-flash".

Configure session and flash (before the routes):

```js
// app.js
const sessionConfig = {
  secret: SESSION_CONFIG_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
```

We use a middleware to make the flash message available in all templates, instead of passing the message to each template route. These also goes before the routes:

```js
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
```

On the routes, now we can create flash messages when needed. Alert (flash message) displayed when creating a new campground:

```js
router.post(
  '/new',
  validateCampground,
  catchAsync(async (req, res) => {
    console.log(req);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}/show`);
  })
);
```

We are making the messages available for the templates, but we must include them in the templates' code for the messages to be actually displayed. We include the flash partial inside the head partial because the head partial is included by every other view (the flash message should always be available).

```html
<!-- ... -->
<body>
  <%- include('./navbar') %>
  <main class="container mt-5">
    <%- include('./flash') %>
    <!-- ... -->
  </main>
</body>
```

## Authentication

This sections makes a lot of use of the 'passport' package for authentication. This package adds methods to the model, adds methods to req and res, has static methods, adds information to the session, etc. It makes a lot of abstraction of the authentication process. We are using 3 new npm packages to handle authentication:

```
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "passport-local-mongoose": "^8.0.0"
```

### Passport configurarion

We need the 'User' model already impoted in app.js.

```js
// app.js
import passport from 'passport';
import LocalStrategy from 'passport-local';

// ...

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

### User model

The user model needs to use the passport plugin. The user will have username, email and password, but we only define the email on the schema... Passport takes care of adding the username and password hash (I think) and adds static methods to the user model.

```js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);
export default mongoose.model('User', UserSchema);
```

### isLoggedIn Middleware

This middleware checks if the user is logged in. the .isAuthenticated() method is automatically added to req by passport! Aldo important: `req. session.returnTo = req.originalUrl;`.

```js
// isLoggedIn.js
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'you must be signed in');
    return res.redirect('/users/login');
  }
  next();
}

export default isLoggedIn;
```

Usage of the `isLoggedIn` middleware:

```js
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});
```

### storeReturnTo middleware

The session gets cleared after a successful login (passport clears it for security). We need to store the req.session.returnTo value into res.locals object with a middleware that runs before the login.

```js
/**
 * Middleware that saves returnTo value from the
 * session (req.session.returnTo) to res.locals
 */

function storeReturnTo(req, res, next) {
  console.log(req.session); // TODO: Remove console.log
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

export default storeReturnTo;
```

We store the 'return to' url in the session with the `isLoggedIn` middleware.

```js
funcion isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

export default isLoggedIn;
```

But it will be cleared after a successful login, so we must run th `storeReturnTo` middleware right before the login route.

```js
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
```

By using the storeReturnTo middleware, we can save the returnTo value to res.locals before passport.authenticate() clears the session and deletes req.session.returnTo.

### Register, login, logout

The 'passport' middleware provides methods `User.register(user, password)` and `req.login(...)`. This login method is intended to be used immediately after creating the user. For normal login we use .authenticate.

```js
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
```

To login, passport provides the `passport.authenticate()` middleware to be used on login routes.

```js
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
```

And to logout, 'passport' provides the `req.logout()` method, which needs a callback.

```js
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds/all');
  });
});
```

The usersRouter.js file makes a lot of use of 'passport'.

### Make the templates know a user is logged in

The user gets stored in `req.user`, so we can store it in `res.locals.currentUser`, so we can acces it from the ejs templates.

```js
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
```

# TODO

- How do I make routes more maintainable? Maybe storing the route signatures in an object, then passing the object to the places where the rounte is needed. Then I would only need to change the routes in one place. The route would need to pass to the routes js files and the ejs files.
