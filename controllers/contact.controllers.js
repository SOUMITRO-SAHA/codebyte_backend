const Contact = require('../models/contact.schema');

exports.createContact = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    const newContact = new Contact({
      author: req.user._id,
      email,
      subject,
      message,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      contact: savedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.updateContactById = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedContact) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, contact: updatedContact });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteContactById = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
