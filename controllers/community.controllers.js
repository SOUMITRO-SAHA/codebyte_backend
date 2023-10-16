const Community = require('../models/community.schema');
const Comment = require('../models/comment.schema');

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
    const communities = await Community.find()
      .populate('userId', 'name')
      .populate('comments');

    res.status(200).json({ success: true, communities });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get a community by its ID
exports.getCommunityById = async (req, res) => {
  const { id: communityId } = req.params;

  try {
    const community = await Community.findById(communityId).populate(
      'comments'
    );

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found',
      });
    }

    res.status(200).json({
      success: true,
      community,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update a community by its ID
exports.updateCommunityById = async (req, res) => {
  const { id: communityId } = req.params;
  const updateData = req.body;

  try {
    const updatedCommunity = await Community.findByIdAndUpdate(
      communityId,
      updateData,
      { new: true }
    );

    if (!updatedCommunity) {
      return res.status(404).json({
        success: false,
        message: 'Community not found',
      });
    }

    res.status(200).json({
      success: true,
      community: updatedCommunity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteCommunityById = async (req, res) => {
  const { id: communityId } = req.params;

  try {
    const deletedCommunity = await Community.findByIdAndDelete(communityId);

    if (!deletedCommunity) {
      return res.status(404).json({
        success: false,
        message: 'Community not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Community deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { communityPostId: postId, text } = req.body;

    const communityPost = await Community.findById(postId);

    if (!communityPost) {
      return res.status(404).json({
        success: false,
        message: 'Community post not found',
      });
    }

    const newComment = new Comment({
      post: postId,
      author: req.user._id,
      text,
    });

    const savedComment = await newComment.save();

    communityPost.comments.push(savedComment._id);
    await communityPost.save();

    res.status(201).json({
      success: true,
      comment: savedComment,
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
