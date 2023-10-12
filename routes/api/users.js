const express = require("express");
const router = express.Router();
const userLogic = require("../../models/users");
const auth = require("../../config/config-passport");
const fs = require("fs").promises;
const multer = require("multer");
const path = require("path");
const uploadDir = path.join(process.cwd(), "tmp");
const imgStorage = path.join(process.cwd(), "public/avatars");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

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

router.patch(
  "/avatar",
  upload.single("picture"),
  auth,
  async (req, res, next) => {
    const user = req.user;
    const { path: temporaryName } = req.file;
    try {
      const newImgName = String(user._id) + ".png";
      const fileName = path.join(imgStorage, newImgName);
      await userLogic.imgEdit(temporaryName, fileName);
      await fs.rm(temporaryName);

      user.avatarURL = fileName;
      await user.save();
    } catch (err) {
      await fs.unlink(temporaryName);
      return next(err);
    }
    res.json({
      avatar: user.avatarURL,
      message: "Plik załadowany pomyślnie",
      status: 200,
    });
  }
);

module.exports = router;
