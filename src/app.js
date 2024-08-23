require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./db/connection");
const userRouter = require("./Routes/userRouter");
const postRouter = require("./Routes/postRouter");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const port = process.env.PORT | 8080;
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
