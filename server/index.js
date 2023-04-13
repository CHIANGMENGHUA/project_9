const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
const cors = require("cors");
require("./config/passport")(passport);
dotenv.config();

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("connect to mongodb ...");
  })
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API
app.use("/api/auth", authRoute);
// courseRoute 應該被 JWT 保護
// 如果 request header 內部沒有 JWT，則 request 就會被視為是 unauthorized
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("Backend server is working on port 8080 !!");
});
