const express = require("express");
const router = express.Router();
const userLogic = require("../../models/users");

router.post("/signup", async (req, res, next) => {
  try {
    const { password, email } = req.body;

    if (
      !req.body.hasOwnProperty("password") ||
      typeof password !== "string" ||
      !req.body.hasOwnProperty("email") ||
      typeof email !== "string"
    ) {
      return res.status(400).json({ message: "Email or Password are invalid" });
    }
    const newUser = await userLogic.addUser(req.body);

    if (newUser === "alreadyUp") {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    res.status(200).json({ message: "succes", user: "added", data: req.body });
  } catch (error) {
    console.error(error);
  }
});

router.patch("/login", async (req, res, next) => {
  try {
    const { password, email } = req.body;

    if (
      !req.body.hasOwnProperty("password") ||
      typeof password !== "string" ||
      !req.body.hasOwnProperty("email") ||
      typeof email !== "string"
    ) {
      return res.status(400).json({ message: "Email or Password are invalid" });
    }
    const user = await userLogic.Login(req.body);

    if (user == "notUp") {
      return res.status(404).json({ message: "Email not found" });
    } else if (user == "passNotOk") {
      return res.status(409).json({ message: "Incorrect Password" });
    }

    res.status(200).json({
      status: "updated",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
