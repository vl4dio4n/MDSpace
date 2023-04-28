const express = require('express');
const { GroupsController } = require('../controllers/GroupsControler');
const { AuthenticationController } = require('../controllers/AuthenticationController');

const groupsRoutes = express.Router();

groupsRoutes.get('/get-messages', AuthenticationController.isAuthenticated, GroupsController.getMessages);
groupsRoutes.get('/get-group-info', AuthenticationController.isAuthenticated, GroupsController.getGroupInfo);
groupsRoutes.post('/edit-group-profile', AuthenticationController.isAuthenticated, GroupsController.editGroupProfile);
groupsRoutes.post('/kick-group-member', AuthenticationController.isAuthenticated, GroupsController.kickGroupMember);
groupsRoutes.post('/promote-group-member', AuthenticationController.isAuthenticated, GroupsController.promoteGroupMember);
groupsRoutes.post('/demote-group-member', AuthenticationController.isAuthenticated, GroupsController.demoteGroupMember);
groupsRoutes.post('/create-group', AuthenticationController.isAuthenticated, GroupsController.createGroup);
groupsRoutes.post('/add-users', AuthenticationController.isAuthenticated, GroupsController.addUsers);
groupsRoutes.post('/create-thread', AuthenticationController.isAuthenticated, GroupsController.createThread);
groupsRoutes.post('/leave-group', AuthenticationController.isAuthenticated, GroupsController.leaveGroup);

module.exports = { groupsRoutes };