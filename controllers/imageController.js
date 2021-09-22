const gfs = require("../config/db").gfs;
const util = require("util");
const mongoose = require("mongoose");
const singleUpload = util.promisify(require("../lib/imageUtil").single("file"));
const multipleUpload = util.promisify(
  require("../lib/imageUtil").array("multi-files", 10)
);

const Image = require("../models/images");

const imageController = {
  // upload a single image to mongodb
  uploadImage: async (req, res) => {
    // waiting for image upload to the db, the image info will be stored in the req.file
    await singleUpload(req, res);

    // no file found
    if (req.file === undefined) {
      return null;
    }

    // make a new image collection
    try {
      const image = await Image.create({
        filename: req.file.filename,
        fileId: req.file.id,
      });
      return image;
    } catch (err) {
      return null;
    }
  },

  // upload multiple image to mongodb
  uploadMultipleImage: async (req, res) => {
    let allImgs = [];
    try {
      // upload images to the db, the image info will be stored in the req.files
      await multipleUpload(req, res);
      // no image found
      if (req.files.length <= 0) {
        return null;
      }
      // create multiple image collections
      for (image of req.files) {
        const image = await Image.create({
          filename: image.filename,
          fileId: image.id,
        });
        allImgs.push(image);
      }
      return allImgs;
    } catch (error) {
      return null;
    }
  },

  // Get an image from the db via file name. Convert it to stream and pipe it to
  // the client
  getImageByFilename: async (req, res) => {
    const filename = req.params.filename;

    // find the file by filename
    gfs.find({ filename }).toArray((err, file) => {
      if (!files[0] || files.length === 0) {
        res.status(500).json({ success: false, message: "no files found" });
      }

      // The file is an image, so pipe the stream to frontend
      if (
        files[0].contentType === "imagejpeg" ||
        files[0].contentType === "imagepng"
      ) {
        gfs.openDownloadStreamByName(filename).pipe(res);
      } else {
        res.status(500).json({ success: false, message: "not image" });
      }
    });
  },

  // delete an image using gfs.delete
  deleteImageByFileName: async (req, res) => {
    const filename = req.params.filename;
    const id = await Image.findOne({ filename: filename }).fileId;
    gfs.delete(new mongoose.Types.ObjectId(id), (err, data) => {
      if (err) {
        res.json({ data: null, statusCode: 404 });
      }
      res.json({ data: null, statusCode: 200 });
    });
  },
};

module.exports = imageController;
