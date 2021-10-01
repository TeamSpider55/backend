const methodOverride = require("method-override");
const multer = require("multer");
const GridFsStroage = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();

CONNECTION_STRING =
  "mongodb+srv://<username>:<password>@cluster0.hgv0d.mongodb.net/crm?retryWrites=true&w=majority";

MONGO_URL = CONNECTION_STRING.replace(
  "<username>",
  process.env.MONGO_USERNAME
).replace("<password>", process.env.MONGO_PASSWORD);

// create storage engine
const storage = new GridFsStroage({
  url: MONGO_URL,
  file: (req, file) => {
    // construct a new file name
    const filename =
      crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);

    // matching the file type to ensure it's an image
    const match = ["image/png", "image/jpeg"];
    if (match.find(file.mimetype) === -1) {
      return null;
    }
    return {
      filename: filename,
      bucketname: "uploads",
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
