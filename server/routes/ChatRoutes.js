const express = require('express');
const { ChatController } = require('../controllers/ChatController');
const { AuthenticationController } = require('../controllers/AuthenticationController');

const chatRoutes = express.Router();

chatRoutes.post('/update-last-activity', AuthenticationController.isAuthenticated, ChatController.updateLastActivityEnd);

module.exports = { chatRoutes };