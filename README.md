# YelpCamp

Web App created with **Node.js** and **MongoDB**.

## Routes

| PATH                    | VERB   | PURPOSE                           |
| ----------------------- | ------ | --------------------------------- |
| /                       | GET    | Homepage                          |
| /campgrounds            | GET    | Display all campgrounds           |
| /campgrounds/:id/show   | GET    | Show details for one campground   |
| /campgrounds/:id/edit   | GET    | Form to edit one campground       |
| /campgrounds/:id/edit   | PUT    | (Endpoint) to edit one campground |
| /campgrounds/:id/delete | DELETE | Deletes one campground            |
| /campgrounds/new        | GET    | Form to create new campground     |
| /campgrounds/new        | POST   | (Endpoint) Creates new campground |

## Error Handling / Form Validation

- Routes have (req, res, next) signature.
- try/catch blocks inside routes.
  - Some errors will be thrown by node/express.
  - Some errors must be manually thrown (i.e. trying to create an empty campground).
- Using custom ExpressError for manually thronwn errors.
- At the bottom of app.js we have an app.use that catches all errors passed to next() in the routes.
- We are using an error.ejs template to show errors in a more friendly way.

- For the client side form validation we are using Bootstrap.
- TODO: For server side, we must throw errors when needed.
- TODO: Use JOI for server side form validation.