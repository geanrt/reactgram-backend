/* eslint-disable no-undef */
const multer = require("multer");
const path = require("path");
const {validationResult} = require("express-validator");


// PROCESSA E SALVA O ARQUIVO DE IMAGEM
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }

    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// RETORN TRUE PARA SALVAR
const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      req.fileValidationError = "Por favor, envie apenas png ou jpg!";
      return cb(null, false);
    }

    cb(null, true);

  },
});

module.exports = imageUpload;
