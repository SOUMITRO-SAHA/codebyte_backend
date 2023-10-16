const Joi = require('joi');

exports.createProjectValidator = Joi.object({
  projectTitle: Joi.string().required(),
  shortDescription: Joi.string().max(50),
  projectDescription: Joi.string(),
  projectLink: Joi.string(),
  videoLink: Joi.string(),
  sourceCodeLink: Joi.string(),
  category: Joi.string().valid('Free', 'Paid').default('Free'),
  customSlug: Joi.string(),
  techStack: Joi.array().required(),
});

exports.updateProjectValidator = Joi.object({
  projectTitle: Joi.string(),
  shortDescription: Joi.string().max(50),
  projectDescription: Joi.string(),
  projectLink: Joi.string(),
  videoLink: Joi.string(),
  sourceCodeLink: Joi.string(),
  category: Joi.string().valid('Free', 'Paid').default('Free'),
  customSlug: Joi.string(),
});
