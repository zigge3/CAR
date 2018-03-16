const express = require('express');
const userRoutes = require('./auth');
const notificationRoutes = require('./notification');

const authCheckMiddleware = require('../middleware/auth-check');


const router = new express.Router();
router.use('/notification', [authCheckMiddleware, notificationRoutes]);

router.use('/user', userRoutes)

module.exports = router;
