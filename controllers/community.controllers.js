const Community = require('../models/community.schema');

exports.createCommunity = async (req, res) => {
  try {
    const { userId, title, description, category } = req.body;

    const newCommunity = new Community({
      userId,
      title,
      description,
      category,
    });

    const savedCommunity = await newCommunity.save();

    res.status(201).json({ success: true, community: savedCommunity });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate('userId', 'name');

    res.status(200).json({ success: true, communities });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
