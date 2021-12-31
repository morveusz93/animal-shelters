const Joi = require("joi");

module.exports.animalSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.object({
    years: Joi.number().required().min(0),
    months: Joi.number().required().min(0).max(11),
  }).required(),
  image: Joi.string().required(),
});
