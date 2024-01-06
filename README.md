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
