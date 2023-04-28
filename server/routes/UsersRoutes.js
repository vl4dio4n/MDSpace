const express = require('express');
const { UsersController } = require('../controllers/UsersController');
const { AuthenticationController } = require('../controllers/AuthenticationController');

const usersRoutes = express.Router();

usersRoutes.get('/search-user', AuthenticationController.isAuthenticated, UsersController.searchUser);
usersRoutes.get('/get-contacts', AuthenticationController.isAuthenticated, UsersController.getContacts);
usersRoutes.get('/get-user-profile', AuthenticationController.isAuthenticated, UsersController.getUserProfile);
usersRoutes.post('/edit-user-profile', AuthenticationController.isAuthenticated, UsersController.editUserProfile);

module.exports = { usersRoutes };