const express = require('express');
const { SearchUserService } = require('../services/SearchUserService');
const { ChatService } = require('../services/ChatService');
const { AuthenticationController } = require('../controllers/AuthenticationController');

const servicesRoutes = express.Router();

servicesRoutes.get('/search-user', AuthenticationController.isAuthenticated, SearchUserService.searchUser);
servicesRoutes.get('/get-contacts', AuthenticationController.isAuthenticated, SearchUserService.getContacts);
servicesRoutes.get('/get-user-profile', AuthenticationController.isAuthenticated, SearchUserService.getUserProfile);
servicesRoutes.get('/get-messages', AuthenticationController.isAuthenticated, ChatService.getMessages);
servicesRoutes.get('/get-group-info', AuthenticationController.isAuthenticated, ChatService.getGroupInfo);
servicesRoutes.post('/edit-user-profile', AuthenticationController.isAuthenticated, SearchUserService.editUserProfile);
servicesRoutes.post('/edit-group-profile', AuthenticationController.isAuthenticated, ChatService.editGroupProfile);
servicesRoutes.post('/kick-group-member', AuthenticationController.isAuthenticated, ChatService.kickGroupMember);
servicesRoutes.post('/promote-group-member', AuthenticationController.isAuthenticated, ChatService.promoteGroupMember);
servicesRoutes.post('/demote-group-member', AuthenticationController.isAuthenticated, ChatService.demoteGroupMember);
servicesRoutes.post('/create-group', AuthenticationController.isAuthenticated, ChatService.createGroup);
servicesRoutes.post('/add-users', AuthenticationController.isAuthenticated, ChatService.addUsers);

module.exports = { servicesRoutes };