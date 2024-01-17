import express from 'express';
const router = express.Router();
import passport from 'passport';
import catchAsync from '../middlewares/catchAsync.js';
import storeReturnTo from '../middlewares/storeReturnTo.js';
import * as usersController from '../controllers/users.controller.js';

// * REGISTER NEW USER
router.get('/register', usersController.registerUserForm);

router.post('/register', catchAsync(usersController.createUser));

// * LOGIN
router.get('/login', usersController.loginUserForm);

router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/users/login',
  }),
  usersController.loginUserFlashRedirect
);

// * LOGOUT
router.get('/logout', usersController.logoutUser);

export default router;
