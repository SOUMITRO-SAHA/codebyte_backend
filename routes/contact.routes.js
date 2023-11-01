const express = require('express');
const router = express.Router();
const contactControllers = require('../controllers/contact.controllers');

// Create a new contact
router.post('/', contactControllers.createContact);

// Get all contacts
router.get('/', contactControllers.getAllContacts);

// Get a specific contact by ID
router.get('/:id', contactControllers.getContactById);

// Update a specific contact by ID
router.put('/:id', contactControllers.updateContactById);

// Delete a specific contact by ID
router.delete('/:id', contactControllers.deleteContactById);

module.exports = router;
