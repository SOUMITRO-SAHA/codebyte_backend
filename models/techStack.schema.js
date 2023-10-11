const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TechStack', techStackSchema);
