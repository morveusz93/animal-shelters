const { animalSchema } = require("../validationSchemas");
const ExpressError = require("./ExpressError");

module.exports.validateAnimal = (req, res, next) => {
  const validationResult = animalSchema.validate(req.body);
  const { error } = validationResult;
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
