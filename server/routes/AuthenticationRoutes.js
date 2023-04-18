const express = require('express');
const { AuthenticationController } = require('../controllers/AuthenticationController');

const authRoutes = express.Router();

authRoutes.post('/register', AuthenticationController.register);
authRoutes.post('/signin', AuthenticationController.signin);
authRoutes.get('/signout', AuthenticationController.signout);
authRoutes.get('/verify', AuthenticationController.getSessionUser);

module.exports = { authRoutes };