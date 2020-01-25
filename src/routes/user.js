const express = require('express');
const {check} = require('express-validator');

const User = require('../controllers/user');

const router = express.Router();

const validate = require('../middlewares/validate');

//fetching farmer profile
router.post('/farmer/profile', User.fetch_farmer_profile);

//SHOW
router.post('/farmer/add_geofence',  User.add_geofence);

//UPDATE
router.put('/:id',  User.update);

//DELETE
router.delete('/:id', User.destroy);

//UPLOAD
router.post('/upload', User.upload);

module.exports = router;