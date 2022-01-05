const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

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

const sessionConfig = {
  secret: "schroniskowysekret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  console.log(req.flash("success"));
  res.locals.error = req.flash("error");
  next();
});

// ----------------------------- ROUTES -----------------------------

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/shelters", sheltersRouter);
app.use("/animals", animalsRouter);

// // ----------------------------- ERRORS -----------------------------

app.all("*", (req, res, next) => {
  next(new ExpressError("Pagen not found ;(", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! We have a problem!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening at port :3000...");
});
