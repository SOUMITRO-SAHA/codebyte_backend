const mongoose = require('mongoose');
const { AuthRoles } = require('../utils/authRoles.js');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const { config } = require('../config');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: [50, 'Name must be less than 50 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.',
      ],
    },
    phone: {
      type: String,
      unique: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number.'],
    },
    introduction: {
      type: String,
      maxLength: [255, 'Introduction must be less than 255 characters.'],
    },
    socials: [
      {
        name: {
          type: String,
          enum: [
            'Facebook',
            'Twitter',
            'YouTube',
            'Instagram',
            'LinkedIn',
            'Github',
          ],
        },
        link: {
          type: String,
          match: [
            /^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            'Please provide a valid URL.',
          ],
        },
      },
    ],
    password: {
      type: String,
      required: [true, 'password is required'],
      minLength: [8, 'password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password - hooks
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// add more features directly to your schema
userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  //generate JWT TOKEN
  getJwtToken: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRY,
      }
    );
  },

  // Generate Forgot Password token + timeout
  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString('hex');

    //step 1 - save to DB
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(forgotToken)
      .digest('hex');

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    //step 2 - return values to user
    return forgotToken;
  },
};

module.exports = mongoose.model('User', userSchema);
