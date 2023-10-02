const fs = require("fs/promises");
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const contactsPath = path.join(__dirname, "contacts.json");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const singleContact = mongoose.model("Contact", contactSchema);

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});


const saveContacts = async (contacts) => {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const listContacts = async () => {
  try {
    return await singleContact.find();
  } catch (error) {
    console.error(error)
  }
};

const getContactById = async (contactId) => {
  try {
    return await singleContact.findById(contactId)
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    await singleContact.findByIdAndDelete(contactId);
    return true;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const { error } = joiSchema.validate(body);
    const contact = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      phone: body.phone,
    };
    if (error) {
      return false;
    }
    let data = [contact, ...contacts];
    await saveContacts(data);
    return contact;
  } catch (error) {
    console.error(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const { error } = joiSchema.validate(body);
    if (error) {
      return [];
    }

    const contact = await contacts.filter((el) => {
      return el.id === contactId;
    });

    const indexOfContact = contacts.indexOf(contact[0]);

    let data = contacts;
    data[indexOfContact].name = body.name;
    data[indexOfContact].email = body.email;
    data[indexOfContact].phone = body.phone;
    console.log(indexOfContact, data);
    await saveContacts(data);
    return data[indexOfContact];
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
};
