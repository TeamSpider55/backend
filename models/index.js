require("dotenv").config();
const mongoose = require("mongoose");

CONNECTION_STRING =
  "mongodb+srv://<username>:<password>@cluster0.hgv0d.mongodb.net/crm?retryWrites=true&w=majority";

MONGO_URL = CONNECTION_STRING.replace(
  "<username>",
  process.env.MONGO_USERNAME
).replace("<password>", process.env.MONGO_PASSWORD);

mongoose.connect(MONGO_URL || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "crm",
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

require('../models/schedules');
