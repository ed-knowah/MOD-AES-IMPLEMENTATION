const Joi = require("@hapi/joi");

const validateUser = Joi.object({
  firstname: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
  address: Joi.string().min(6),
  city: Joi.string().min(2),
  gender: Joi.string().min(4).max(6),
  zip: Joi.string().min(3).max(6),
  fileKey: Joi.string().min(4),
});

module.exports = {
  validateUser,
};
