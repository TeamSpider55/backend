const router = require("express").Router();
const Image = require("../models/image");
const imageController = require("../controllers/imageController");

// Render the imaqge
router.get("/render/:filename", imageController.getImageByFilename);
