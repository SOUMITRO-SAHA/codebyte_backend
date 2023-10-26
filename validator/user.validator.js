const Joi = require('joi');

// Register User Validator
exports.registerUserValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(data);
};

// Login User Validator
exports.loginUserValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(data);
};

// Update Profile Validator
exports.updateProfileValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    introduction: Joi.string().max(255).optional(),
  });

  return schema.validate(data);
};

// Add Socials Validators
exports.socialsProfileValidators = (data) => {
  const schema = Joi.object({
    socials: Joi.array().items(
      Joi.object({
        name: Joi.string().valid(
          'Facebook',
          'Twitter',
          'YouTube',
          'Instagram',
          'LinkedIn',
          'Github'
        ),
        link: Joi.string().pattern(
          /^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        ),
      })
    ),
  });

  return schema.validate(data);
};
