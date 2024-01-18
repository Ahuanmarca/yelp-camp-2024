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

## Form Validation

- Server form validation with **Joi**
- Client form validation with **Bootstrap**
- Session and Flash Messages (Alerts) with "express-session" and "connect-flash"
- Authentication with "passport" - **Adds methods to the models, req, res, has static methods, adds information to the session, etc.**. It makes a lot of abstraction of the authentication process.

# TODO

- How do I make routes more maintainable? Maybe storing the route signatures in an object, then passing the object to the places where the rounte is needed. Then I would only need to change the routes in one place. The route would need to pass to the routes js files and the ejs files.
- Screen captures
- Explain how to use the app
- BugFix Caroussel on show page (Bootstrap)
- BugFix collapsible nav bar, nav partial (Bootstrap)
- Should I add the reviews to the model on the seeds?
