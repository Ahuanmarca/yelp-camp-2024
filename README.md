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

Some routes don't need to be so specific, but I find it more readable this way. For instance, the "Display all campgrounds" route could be just

```
/campgrounds/
```

but I find it more readable if it is

```
/campgrounds/all
```

## Error Handling / Form Validation

Not using try/catch blocks, but instead...

- catchAsync function is defined in separate file. It's a higher order function that expects the route's async function as it's argument.

```js
// catchAsync.js
function catchAsync(asyncFunc) {
  return (req, res, next) => {
    asyncFunc(req, res, next).catch(next);
  };
}

export default catchAsync;
```

- Routes don't have "(req, res, next)" signature. Instead, routes' functions are wrapped in the catchAsync funtion. Example:

```js
app.get(
  "/campgrounds/all",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
```

- Using **joi** package for form validations.

- Some errors will be thrown by node, others are thrown by **Joi** form validations. We can also manually throw ExpressError.

- At the bottom of app.js we have an app.use that catches all errors passed to next() in the routes // For now there is no next() in the routes, only in the catchAsync middleware.

- We are using an error.ejs template to show errors in a more friendly way.

- For the client side form validation we are using Bootstrap.

# TODO

- How do I make routes more maintainable? Maybe storing the route signatures in an object, then passing the object to the places where the rounte is needed. Then I would only need to change the routes in one place. The route would need to pass to the routes js files and the ejs files.
