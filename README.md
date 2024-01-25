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

- Create /repository directory inside /src. Database queries can be centralized here!
- Show selected files to upload (research other ways, I don't like the one from the course)
- Add option to use image URLs instead of uploading
- Limit how many images can be uploaded, size of the images, etc
- Refactor MapBox scripts that are inside index.ejs and show.ejs views. Put them on /public/scripts directory (problem: making the variables available on the script).
- Fix bugs!

# Bugs

- Thumbnails on edit page only work for Cloudinary hosted images. I have a lot of Unsplash images that I don't want to get rid of.
- Caroussel on show page (Bootstrap) incorreclty displaying images
- Collapsible nav bar, nav partial (Bootstrap), not showing links vertically!
- (Not technically a bug) VSCode shows errors on ejs templates where any ejs tags "<% ... %>" are used inside a "<script></script>" tag. I think the reason is because ejs is not valid JavaScript, and VSCode sees it as "incorrect" syntax inside of the "<script></script>" tags. How can I make those warnings go away?