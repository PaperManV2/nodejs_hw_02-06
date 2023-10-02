const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT;
const uriDb = process.env.MONGO_DB_SRV;

const startServer = () => {
  try {
    const connection = mongoose.connect(uriDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection run");

    connection
      .then(() => {
        app.listen(PORT, function () {
          console.log(`Server running. Use our API on port: ${PORT}`);
        });
      })
      .catch((err) =>
        console.log(`Server not running. Error message: ${err.message}`)
      );
  } catch (error) {
    console.log("couldn't connect to database");
    console.log(error);
    process.exit(1);
  }
};
startServer();
