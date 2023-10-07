const express = require("express");

const router = express.Router();
const contactLogic = require("../../models/contacts");
const schema = require("../../services/schemas/contact");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactLogic.listContacts();
    if (contacts.length !== 0) {
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
  } catch (error) {
    console.error(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const newContact = await contactLogic.addContact(req.body);
    res.json({
      status: "success",
      code: 201,
      data: { newContact },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactDeleted = await contactLogic.removeContact(contactId);
    if (contactDeleted) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const contactUpdated = await contactLogic.updateContact(
      contactId,
      req.body
    );
    res.json({
      status: "success",
      code: 201,
      data: { contactUpdated },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const body = req.body;

    if (!body.hasOwnProperty("favorite")) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const contactUpdated = await contactLogic.updateStatus(contactId, req.body);
    res.json({
      status: "success",
      code: 201,
      data: { contactUpdated },
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
