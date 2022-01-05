const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateAnimal } = require("../utils/validators");
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
    if (!animal) {
      req.flash("error", "Sorry, can't find the animal");
      res.redirect("/animals");
    }
    res.render("animals/animal", { animal });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      req.flash("error", "Sorry, can't find the animal");
      res.redirect("/animals");
    }
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
    req.flash("success", "Successfully edited the animal in shelter!");
    res.redirect(`/animals/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await Animal.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted the animal in shelter!");
    res.redirect("/animals");
  })
);

module.exports = router;
