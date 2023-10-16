const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    thumbnail: {
      type: String,
      required: true,
    },
    projectTitle: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxLength: [
        50,
        'The Short Description of the Project, should not exceed 50 characters',
      ],
    },
    projectDescription: {
      type: mongoose.Schema.Types.Mixed,
    },
    projectLink: {
      type: String,
    },
    videoLink: {
      type: String,
    },
    sourceCodeLink: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Free', 'Paid'],
      default: 'Free',
    },
    customSlug: {
      type: String,
    },
    techStack: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
