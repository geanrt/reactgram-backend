/* eslint-disable no-undef */
// const mongoose = require("mongoose")
const express = require("express");
const router = express.Router();

// controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoByid,
  updatePhoto,
  likeThePhoto,
  commentPhoto,
  deleteCommentPhoto,
  searchPhotos,
  getComments,
} = require("../controllers/PhotoController");

// middlewares
const {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
} = require("../middlewares/photoValidation");

const authGuard = require("../middlewares/authGuard");
const [validateForm, validate] = require("../middlewares/handleValidation");
const imageUpload = require("../middlewares/imageUpload");
const processForm = require("../middlewares/processForm");

// routes

// PUBLISH
// VALIDA A PHOTO
router.post(
  "/validate",
  authGuard,
  processForm.single("image"),
  photoInsertValidation(),
  validateForm,
);
// SALVA A FOTO DEPOIS DE VALIDAR
router.post(
  "/save",
  authGuard,
  imageUpload.single("image"),
  insertPhoto
);

// DELETE PHOTO
router.delete("/:id", authGuard, deletePhoto);

// ALL PHOTOS
router.get("/", getAllPhotos);

// ALL USER PHOTOS 
router.get("/user/:id", authGuard, getUserPhotos);

// SEARCH
router.get("/search", authGuard, searchPhotos);

// PHOTO BY ID
router.get("/:id", authGuard, getPhotoByid);

// UPDATE PHOTO
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);

// LIKE IN THE PHOTO
router.put("/like/:id", authGuard, likeThePhoto);

// COMMENT IN THE PHOTO
router.put(
  "/comment/:id",
  authGuard,
  commentValidation(),
  validate,
  commentPhoto
);
// DELETE COMMENT IN THE PHOTO
router.put("/deletecomment/:id/:commentid", authGuard, deleteCommentPhoto);

// GET ALL COMMENTS IN THE PHOTO
router.get("/comments/:id", authGuard, getComments);

module.exports = router;
