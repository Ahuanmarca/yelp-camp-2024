import express from 'express';
const router = express.Router();
import passport from 'passport';
import catchAsync from '../middlewares/catchAsync.js';
import storeReturnTo from '../middlewares/storeReturnTo.js';
import * as usersController from '../controllers/users.controller.js';

router
  .route('/register')
  .get(usersController.registerUserForm)
  .post(catchAsync(usersController.createUser));

router
  .route('/login')
  .get(usersController.loginUserForm)
  .post(
    storeReturnTo,
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/users/login',
    }),
    usersController.loginUserFlashRedirect
  );

router.get('/logout', usersController.logoutUser);

export default router;
