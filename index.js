const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError");
const sheltersRouter = require("./routes/shelters");
const animalsRouter = require("./routes/animals");

mongoose.connect("mongodb://localhost:27017/animal-shelter");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/shelters", sheltersRouter);
app.use("/animals", animalsRouter);

// // ----------------------------- ERRORS -----------------------------

app.all("*", (req, res, next) => {
  next(new ExpressError("Pagen not found ;(", 404));
});

// catch all errors
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! We have a problem!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening at port :3000...");
});
