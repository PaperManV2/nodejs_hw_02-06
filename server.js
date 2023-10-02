const app = require('./app')
const mongoose = require("mongoose");


const startServer = async () => {
  try {
    const connection = await mongoose.connect(uriDb);
    console.log("Database connection run");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000")
    })
  } catch (error) {
    console.log("couldn't connect to database");
    console.log(error);
    process.exit(1);
  }
}


