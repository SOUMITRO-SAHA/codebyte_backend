const User = require('../models/user.schema.js');
const {
  registerUserValidator,
  loginUserValidator,
  socialsProfileValidators,
  updateProfileValidator,
} = require('../validator/user.validator.js');
const { cookieOptions } = require('../utils/cookieOptions.js');
const { config } = require('../config/index.js');
const {
  sendForgetPasswordTokenByEmail,
} = require('../services/emailSender.js');

exports.registration = async (req, res) => {
  try {
    // Validate the Input:
    const { error, value } = registerUserValidator(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.details[0].message,
      });
    }

    const { name, email, password } = value;
    // Checking whether the user is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send({
        success: false,
        message: 'User already registered, please try login',
      });
    }

    // If User is not registered the create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = user.getJwtToken();
    user.token = token;

    // Save the updated user
    await user.save();

    // Remove the password from the response
    user.password = undefined;

    res.status(200).cookie('token', token, cookieOptions).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginUserValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.details[0].message,
      });
    }

    const { email, password } = value;

    // Finding the user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.send({
        success: false,
        message: 'User not found! Please register',
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
      const token = user.getJwtToken();
      // Refresh the token
      user.token = token;

      // Save the updated user
      await user.save();

      // Remove the password from the response
      user.password = undefined;
      res.cookie('token', token, cookieOptions);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user,
      });
    }

    res.send({
      success: false,
      message: 'Invalid credentials',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.logOut = async (req, res) => {
  try {
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Successfully logged out',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while logging out',
      error: error.message,
    });
  }
};

exports.checkSession = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: 'You are authenticated!',
        user: req.user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const resetToken = await user.generateForgotPasswordToken();

    // Send the Email Here:
    const message = await sendForgetPasswordTokenByEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Reset token sent to you email',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Profile Controllers:
// Update user profile information
exports.updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileValidator(req.body);
    if (error) {
      return res.status(403).json({
        success: false,
        message: 'Validation failed',
        error: error.details[0].message,
      });
    }

    const { name, phone, introduction } = value;

    // Find the user by ID and update their profile information
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, introduction },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get all the users Information
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({
        success: false,
        message: 'Users not found',
      });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get user by User Id
exports.getUserById = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId).select(
      'name email phone socials followers following '
    );

    if (!user) {
      return res.send({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get the User Information
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if the current password matches the stored password
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid current password',
      });
    }

    // Updating the Password of the users
    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the Password of the user with the hashed password
    user.password = hashedPassword;

    const token = user.getJwtToken();

    // Refresh the token
    user.token = token;

    // Save the updated user
    await user.save();

    // Remove the password from the response
    user.password = undefined;
    return res.cookie('token', token, cookieOptions).status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Add social links to user profile
exports.addSocials = async (req, res) => {
  try {
    const { error, value } = socialsProfileValidators(req.body);

    if (error) {
      return res.send({
        success: false,
        message: 'Validation failed',
        error: error.message,
      });
    }

    const { socials } = value;

    // Find the user by ID and update their social links
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { socials },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update user's social links
exports.updateSocials = async (req, res) => {
  try {
    const { error, value } = socialsProfileValidators(req.body);

    if (error) {
      return res.send({
        success: false,
        message: 'Validation failed',
        error: error.details[0].message,
      });
    }

    const { socials } = value;

    const updatedUser = await User.findById(req.user._id);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    socials.forEach((social) => {
      const existingSocial = updatedUser.socials.find(
        (s) => s.name === social.name
      );

      if (existingSocial) {
        existingSocial.link = social.link;
      } else {
        updatedUser.socials.push(social);
      }
    });

    const savedUser = await updatedUser.save();

    res.status(200).json({
      success: true,
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Remove a specific social link
exports.removeSocial = async (req, res) => {
  try {
    const { socialId } = req.params;

    // Find the user by ID and remove the specified social link
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { socials: { _id: socialId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// follow + un-follow APIs
// Follow Controller
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (userToFollow.followers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user',
      });
    }

    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    req.user.following.push(userToFollow._id);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'You are now following this user',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Un-follow Controller
exports.UnFollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userToUnFollow = await User.findById(userId);

    if (!userToUnFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!userToUnFollow.followers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user',
      });
    }

    userToUnFollow.followers = userToUnFollow.followers.filter(
      (follower) => follower.toString() !== req.user._id.toString()
    );
    await userToUnFollow.save();

    req.user.following = req.user.following.filter(
      (following) => following.toString() !== userToUnFollow._id.toString()
    );
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'You have un-followed this user',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
