# YelpCamp

Web app created with **Node**, **Express**, **MongoDB** and **mongoose**.

## Description

The purpose of this project is practice, practice, practice. I want to learn how to do backend with JavaScript. I want to understand the basic concepts so I can switch to another languages and frameworks (like Python with Django).

I'm currently learning from a bunch of free YouTube tutorials and the Web Development Bootcamp from Colt Steele. It's a great source, but I'm not very happy about using MongoDB, so my next step is to rebuild this app with some flavour of SQL.

**Concepts**

- CRUD operations
- RESTful routes
- Templating (EJS)
- Middleware
- Creating a database (MongoDB)
- Connecting to the database (mongoose)
- Manipulating the database


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

## Can't get this to work
- Client side form validation with Bootstrap. Form gets submitted, even if it´s empty. Tooltip won´t show when the form's input is good.
    - *I don´t know how to debug bootstrap.*

