const contact = require("../services/schemas/contact");

const listContacts = async () => {
  try {
    return await contact.find();
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async (contactId) => {
  try {
    return await contact.findById(contactId);
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    return await contact.findByIdAndDelete(contactId);
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (body) => {
  try {
    return await contact.create(body);
  } catch (error) {
    console.error(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    return await contact.findByIdAndUpdate(contactId, body, { new: true });
  } catch (error) {
    console.error(error);
  }
};

const updateStatus = async (contactId, body) => {
  try {
    const { favorite } = body;

    const updatedContact = await contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      console.error("Not found");
      // throw new Error("Not found");
    }

    return updatedContact;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
};
