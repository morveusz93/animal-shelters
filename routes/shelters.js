const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Shelter = require("../models/shelter");
const { validateAnimal } = require("../utils/validators");
const Animal = require("../models/animal");
const animalTypes = Animal.schema.path("type").enumValues;

router.get("/", async (req, res) => {
  const shelters = await Shelter.find({});
  res.render("animals/shelters", { shelters });
});

router.get("/new", (req, res) => {
  res.render("animals/new-shelter");
});

router.post(
  "/",
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
    req.flash("success", "Successfully added a new shelter!");
    res.redirect("/shelters");
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const shelter = await Shelter.findById(id).populate("animals");
    if (!shelter) {
      req.flash("error", "Can't find the shelter");
    }
    res.render("animals/shelter", { shelter });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelted) {
      req.flash("error", "Can't find the shelter");
    }
    res.render("animals/edit-shelter", { shelter });
  })
);

router.put(
  "/:id",
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
    req.flash("success", "Successfully edited the shelter!");
    res.redirect(`/shelters/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedShelter = await Shelter.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the shelter!");
    res.redirect("/shelters");
  })
);

// -------------------------------- ANIMALS --------------------------------

router.get("/:shelterID/animals/new", async (req, res) => {
  const shelter = await Shelter.findById(req.params.shelterID);
  res.render("animals/new-animal", { shelter, animalTypes });
});

router.post(
  "/:shelterID/animals",
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
    req.flash("success", "Successfully added an animal to shelter!");
    res.redirect(`/shelters/${shelter._id}`);
  })
);

module.exports = router;
