/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

// controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById
} = require("../controllers/UserController");

// middlewares
const [validateForm, validate] = require("../middlewares/handleValidation");
const {
  userCreateValidations,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const imageUpload = require("../middlewares/imageUpload");
const saveImage = require('../middlewares/saveImage');
const processForm = require('../middlewares/processForm');

// routes
// registro
router.post("/register", userCreateValidations(), validate, register);
// entrar
router.post("/login", loginValidation(), validate, login);
// ver dados
router.get("/profile", authGuard, getCurrentUser);
// editar dados

// VALIDA A PHOTO
router.put(
  "/validate",
  authGuard,
  processForm.single("profileImage"),
  userUpdateValidation(),
  validateForm,
);
// SALVA A FOTO DEPOIS DE VALIDAR
router.put(
  "/save",
  authGuard,
  imageUpload.single("profileImage"),
  update
);
// pegando dados do usuario por id
router.get("/:id", getUserById)

module.exports = router;
