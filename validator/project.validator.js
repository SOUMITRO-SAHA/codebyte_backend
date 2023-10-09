const Joi = require('joi');

const createProjectValidator = Joi.object({
  projectTitle: Joi.string().required(),
  shortDescription: Joi.string().max(50),
  projectDescription: Joi.string(),
  projectLink: Joi.string(),
  videoLink: Joi.string(),
  sourceCodeLink: Joi.string(),
  category: Joi.string().valid('Free', 'Paid').default('Free'),
  customSlug: Joi.string(),
});

const updateProjectValidator = Joi.object({
  projectTitle: Joi.string(),
  shortDescription: Joi.string().max(50),
  projectDescription: Joi.string(),
  projectLink: Joi.string(),
  videoLink: Joi.string(),
  sourceCodeLink: Joi.string(),
  category: Joi.string().valid('Free', 'Paid').default('Free'),
  customSlug: Joi.string(),
});
module.exports = { createProjectValidator, updateProjectValidator };
