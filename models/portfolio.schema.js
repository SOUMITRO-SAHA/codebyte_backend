const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      required: true,
    },
    liveProjectLink: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Basic URL validation regex
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    techStack: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechStack',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
