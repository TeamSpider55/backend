const router = require('express').Router();
const Image = require('../models/images');
const imageController = require('../controllers/imageController');

// Render the imaqge
router.get('/render/:filename', imageController.getImageByFilename);
