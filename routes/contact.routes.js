const express = require('express');
const router = express.Router();
const contactControllers = require('../controllers/contact.controllers');
const { isLoggedIn } = require('../middleware/auth.middleware');

// Create a new contact
router.post('/', isLoggedIn, contactControllers.createContact);

// Get all contacts
router.get('/', contactControllers.getAllContacts);

// Update a specific contact by ID
router.patch('/:id', isLoggedIn, contactControllers.updateContactById);

// Get a specific contact by ID
router.get('/:id', contactControllers.getContactById);

// Delete a specific contact by ID
router.delete('/:id', isLoggedIn, contactControllers.deleteContactById);

module.exports = router;
