const express = require("express");

const router = express.Router();
const contactLogic = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  contacts = await contactLogic.listContacts();
  if (contacts.legth !== 0) {
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactLogic.getContactById(contactId);
  if (contact.length !== 0) {
    res.json({
      status: "success",
      code: 200,
      data: {
        contact,
      },
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  const contact = await contactLogic.addContact(req.body);
  if (contact) {
    res.json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } else {
    res.status(400).json({ message: "missing required name - field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contactDeleted = await contactLogic.removeContact(contactId);
  if (contactDeleted) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactLogic.updateContact(contactId, req.body);
  if (contact.length !== 0) {
    res.json({
      status: "success",
      code: 200,
      data: {
        contact,
      },
    });
  } else if (contact.length === 0) {
    res.status(400).json({ message: "missing fields" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
