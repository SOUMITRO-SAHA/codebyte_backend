const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const db = require('./config/database.js');
const userRoutes = require('./routes/user.routes.js');

// Establishing the Database connection
db.connect();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('tiny'));

// Routes
app.use(userRoutes);

module.exports = app;
