/* eslint-disable no-undef */
const {body} = require("express-validator");

// VALIDA SE OS DADOS ESTÃO OK
const photoInsertValidation = () => {
  return [
    body("title")
      .not()
      .equals("undefined")
      .withMessage("O título é obrigatório!")
      .isString()
      .withMessage("O titulo é obrigatório!")
      .isLength({min: 3})
      .withMessage("O titulo deve ter 3 caracteres ou mais."),
    body("image").custom((value, {req}) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória!");
      }
      return true;
    }),
  ];
};

const photoUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .isString()
      .withMessage("O O título é obrigatório!")
      .isLength({min: 3})
      .withMessage("O titulo deve ter 3 caracteres ou mais."),
  ];
};

const commentValidation = () => {
  return[
    body("comment").isString().isLength({min: 1}).withMessage("Digite o comentário.")
  ]
}

module.exports = {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation
};
