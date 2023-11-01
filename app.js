const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const db = require('./config/database.js');
const userRoutes = require('./routes/user.routes.js');
const postRoutes = require('./routes/post.routes.js');
const commentRoutes = require('./routes/comment.routes.js');
const likeRoutes = require('./routes/like.routes.js');
const projectRoutes = require('./routes/project.routes.js');
const communityRoutes = require('./routes/community.routes.js');
const techStackRoutes = require('./routes/techStack.routes.js');
const portfolioRoutes = require('./routes/portfolio.routes.js');
const contactRoutes = require('./routes/contact.routes.js');

// Establishing the Database connection
db.connect();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index');
});

// Public
app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  '/uploads/thumbnails',
  express.static(__dirname + '/uploads/thumbnails')
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('tiny'));

// Routes
app.use(userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);
app.use('/projects', projectRoutes);
app.use('/community', communityRoutes);
app.use('/tech-stack', techStackRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/contact', contactRoutes);

module.exports = app;
