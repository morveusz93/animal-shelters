const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Joi = require("joi");

const Animal = require("./models/animal");
const Shelter = require("./models/shelter");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { animalSchema } = require("./validationSchemas");
const animalTypes = Animal.schema.path("type").enumValues;

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

const validateAnimal = (req, res, next) => {
  const validationResult = animalSchema.validate(req.body);
  const { error } = validationResult;
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

// ----------------------------- SHELTERS -----------------------------

app.get("/shelters", async (req, res) => {
  const shelters = await Shelter.find({});
  res.render("animals/shelters", { shelters });
});

app.get("/shelters/new", (req, res) => {
  res.render("animals/new-shelter");
});

app.post(
  "/shelters",
  catchAsync(async (req, res, next) => {
    const { name, country, city, street, email } = req.body;
    const newShelter = new Shelter({
      name: name,
      address: {
        country: country,
        city: city,
        street: street,
      },
      email: email,
    });
    await newShelter.save();
    res.redirect("/shelters");
  })
);

app.get(
  "/shelters/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const shelter = await Shelter.findById(id).populate("animals");
    res.render("animals/shelter", { shelter });
  })
);

app.get(
  "/shelters/:id/edit",
  catchAsync(async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    res.render("animals/edit-shelter", { shelter });
  })
);

app.put(
  "/shelters/:id",
  catchAsync(async (req, res, next) => {
    const { name, country, city, street, email } = req.body;
    const id = req.params.id;
    const editedShelter = await Shelter.findByIdAndUpdate(
      id,
      {
        name: name,
        address: {
          country: country,
          city: city,
          street: street,
        },
        email: email,
      },
      { new: true, runValidators: true }
    );
    res.redirect(`/shelters/${id}`);
  })
);

app.delete(
  "/shelters/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedShelter = await Shelter.findByIdAndDelete(id);
    res.redirect("/shelters");
  })
);

// ----------------------------- ANIMALS -----------------------------

app.get("/animals", async (req, res) => {
  const animals = await Animal.find({});
  res.render("animals/animals", { animals });
});

app.get("/shelters/:shelterID/animals/new", async (req, res) => {
  const shelter = await Shelter.findById(req.params.shelterID);
  res.render("animals/new-animal", { shelter, animalTypes });
});

app.post(
  "/shelters/:shelterID/animals",
  validateAnimal,
  catchAsync(async (req, res, next) => {
    const { name, years, months, image, type } = req.body;
    const shelter = await Shelter.findById(req.params.shelterID);
    const newAnimal = new Animal({
      name: name,
      age: {
        years: years,
        months: months,
      },
      type: type,
      image: image,
      shelter: shelter,
    });
    shelter.animals.push(newAnimal);
    await newAnimal.save();
    await shelter.save();
    res.redirect(`/shelters/${shelter._id}`);
  })
);

app.get(
  "/animals/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id).populate("shelter");
    res.render("animals/animal", { animal });
  })
);

app.get(
  "/animals/:id/edit",
  catchAsync(async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    res.render("animals/edit-animal", { animal, animalTypes });
  })
);

app.put(
  "/animals/:id",
  validateAnimal,
  catchAsync(async (req, res, next) => {
    const { name, years, months, image, type } = req.body;
    const id = req.params.id;
    const editedAnimal = await Animal.findByIdAndUpdate(
      id,
      {
        name: name,
        age: {
          years: years,
          months: months,
        },
        image: image,
        type: type,
      },
      { new: true, runValidators: true }
    );
    res.redirect(`/animals/${id}`);
  })
);

app.delete(
  "/animals/:id",
  catchAsync(async (req, res) => {
    await Animal.findByIdAndDelete(req.params.id);
    res.redirect("/animals");
  })
);

// // ----------------------------- ERRORS -----------------------------

// takes all wrong url, 404 not found
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
