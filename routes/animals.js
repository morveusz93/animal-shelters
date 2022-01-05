const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateAnimal } = require("../utils/validates");
const Animal = require("../models/animal");
const animalTypes = Animal.schema.path("type").enumValues;

router.get("/", async (req, res) => {
  const animals = await Animal.find({});
  res.render("animals/animals", { animals });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id).populate("shelter");
    res.render("animals/animal", { animal });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    res.render("animals/edit-animal", { animal, animalTypes });
  })
);

router.put(
  "/:id",
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

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await Animal.findByIdAndDelete(req.params.id);
    res.redirect("/animals");
  })
);

module.exports = router;
