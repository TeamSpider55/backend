const app = require("./app");

// db: this includes code that opens the connection to the production database
// which is completely **separate** from the one used in testing
// same cluster, different database and collections, hence different
// connection but shared mongoose schemas
require("./config/db")

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`The app is listening on port ${port}!`);
});
  