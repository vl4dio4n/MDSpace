const express = require('express');
const { SearchUserService } = require('../services/SearchUserService');

const servicesRoutes = express.Router();

servicesRoutes.get('/search-user', SearchUserService.searchUser);

module.exports = { servicesRoutes };