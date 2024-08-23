require("dotenv").config();
const { connect } = require("mongoose");
connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err.message));
