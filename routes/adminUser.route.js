const express = require('express');
const router = express.Router();
const { renderAdminUsers, verifyUser, deleteUser } = require('../controllers/admin.controller');

router.route('/')
    .get(renderAdminUsers)
    .delete(deleteUser)
    .put(verifyUser)


module.exports = router;