# YelpCamp

Web app created with **Node**, **Express**, **MongoDB** and **mongoose**.

## RESTful routes

| NAME    | PATH                  | VERB   | PURPOSE                               |
|---------|-----------------------|--------|---------------------------------------|
| Index   | /campgrounds          | GET    | Display all campgrounds               |
| New     | /campgrounds/new      | GET    | Form to create new campground         |
| Create  | /campgrounds          | POST   | Creates a new campground on server    |
| Show    | /campgrounds/:id      | GET    | Details for one specific campground   |
| Edit    | /campgrounds/:id/edit | GET    | Form to edit specific campground      |
| Update  | /campgrounds/:id      | PUT    | Updates specific campground on server |
| Destroy | /campgrounds/:id      | DELETE | Deletes specific item on server       |
