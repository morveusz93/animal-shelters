const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Animal = require("./models/animal");
const Shelter = require("./models/shelter");

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

app.get("/shelters", async (req, res) => {
  const shelters = await Shelter.find({});
  res.render("animals/shelters", { shelters });
});

app.get("/shelters/new", (req, res) => {
  res.render("animals/new-shelter");
});

app.post("/shelters", async (req, res, next) => {
  try {
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
  } catch (e) {
    next(e);
  }
});

app.get("/shelters/:id", async (req, res) => {
  const { id } = req.params;
  const shelter = await Shelter.findById(id);
  res.render("animals/shelter", { shelter });
});

app.get("/shelters/:id/edit", async (req, res) => {
  const shelter = await Shelter.findById(req.params.id);
  res.render("animals/edit-shelter", { shelter });
});

app.put("/shelters/:id", async (req, res, next) => {
  try {
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
  } catch (e) {
    next(e);
  }
});

app.delete("/shelters/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedShelter = await Shelter.findByIdAndDelete(id);
    res.redirect("/shelters");
  } catch (e) {
    next(e);
  }
});

app.get("/animals", async (req, res) => {
  const animals = await Animal.find({});
  res.render("animals/animals", { animals });
});

app.get("/animals/new", (req, res) => {
  res.render("animals/new-animal");
});

app.post("/animals", async (req, res, next) => {
  try {
    const { name, years, months, image } = req.body;
    const newAnimal = new Animal({
      name: name,
      age: {
        years: years,
        months: months,
      },
      image: image,
    });
    await newAnimal.save();
    res.redirect(`/animals/${newAnimal._id}`);
  } catch (e) {
    next(e);
  }
});

app.get("/animals/:id/edit", async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  res.render("animals/edit-animal", { animal });
});

app.put("/animals/:id", async (req, res, next) => {
  try {
    const { name, years, months, image } = req.body;
    const id = req.params.id;
    const editedShelter = await Animal.findByIdAndUpdate(
      id,
      {
        name: name,
        age: {
          years: years,
          months: months,
        },
        image: image,
      },
      { new: true, runValidators: true }
    );
    res.redirect(`/animals/${id}`);
  } catch (e) {
    next(e);
  }
});

app.get("/animals/:id", async (req, res) => {
  const { id } = req.params;
  const animal = await Animal.findById(id);
  res.render("animals/animal", { animal });
});

app.use((err, req, res, next) => {
  res.send("Error");
});

app.listen(3000, () => {
  console.log("Listening at port :3000...");
});
