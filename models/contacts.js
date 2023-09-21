const fs = require("fs/promises");
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const contactsPath = path.join(__dirname, "contacts.json");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const saveContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = await contacts.filter((el) => {
    return el.id === contactId;
  });
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const data = contacts.filter((contact) => {
    return contact.id !== contactId;
  });

  a = data;
  b = contacts;

  if (JSON.stringify(a) === JSON.stringify(b)) {
    return false;
  }
  await saveContacts(data);
  return true;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const { error } = schema.validate(body);
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
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const { error } = schema.validate(body);
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
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
