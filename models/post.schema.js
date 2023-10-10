const { Schema, default: mongoose } = require('mongoose');

const postSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, 'Please provide a title'],
      trim: true,
      maxLength: [255, 'Post title should be a max of 255 characters'],
    },
    content: {
      type: Schema.Types.Mixed,
      minLength: [255, 'Post content should be greater than 255 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
postSchema.index({ author: 1 });
postSchema.index({ comments: 1 });
postSchema.index({ likes: 1 });

module.exports = mongoose.model('Post', postSchema);
