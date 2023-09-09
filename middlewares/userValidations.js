/* eslint-disable no-undef */
const {body} = require("express-validator");

// validação de registro
const userCreateValidations = () => {
  return [
    // verifica nome do usuario
    body("name")
      .isString()
      .withMessage("O nome é obrigatório!")
      .isLength({min: 3})
      .withMessage("Nome mínimo de 3 caracteres."),
    // verifica email do usuario
    body("email")
      .isString()
      .withMessage("O email é obrigatório!")
      .isEmail()
      .withMessage("Insira um email válido."),
    // verifica senha do usuario
    body("password")
      .isString()
      .withMessage("A senha é obrigatória!")
      .isLength({min: 6})
      .withMessage("Senha mínima de 6 caracteres."),
    // verifica confirmação do usuario
    body("confirmpassword")
      .isString()
      .withMessage("Confirmação nescessária!")
      .custom((value, {req}) => {
        if (value != req.body.password) {
          throw new Error("As senhas precisam ser iguais.");
        }
        return true;
      }),
  ];
};

// validação de login
const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Digite um email valido."),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({min: 6})
      .withMessage("Senha invalida."),
  ];
};

// validação de alterações
const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({min: 3})
      .withMessage("O nome precisa ter 3 ou mais caracteres."),
    body("password")
      .optional()
      .isLength({min: 6})
      .withMessage("A senha precisa ter 6 ou mais caracteres."),
  ];
};

module.exports = {
  userCreateValidations,
  loginValidation,
  userUpdateValidation,
};
