const Joi = require("joi");

module.exports.animalSchema = Joi.object({
  name: Joi.string().required(),
  years: Joi.number().required().min(0),
  months: Joi.number().required().min(0).max(11),
  image: Joi.string().required(),
  type: Joi.string().required(),
});
