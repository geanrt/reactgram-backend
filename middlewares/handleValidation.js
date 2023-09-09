/* eslint-disable no-undef */
const {validationResult} = require("express-validator");

// TRATA OS ERROS DE FORMS COM IMAGENS
const validateForm = (req, res, next) => {
  const erros = validationResult(req);

  // CASO NÃO TENHA ERROS ENVIA:
  // DATA:  NULL - PARA EFEITOS PRATICOS NO SLICE
  // ISVALID:  1 - PARA FAZERMOS UMA NOVA REQUISIÇÃO AGORA COM /SAVE
  // MESSAGE:  NULL - PARA EFEITOS PRATICOS NO SLICE

  if (erros.isEmpty() && !req.fileValidationError) {
    res.status(201).json({data: null, isValid: 1, message: null});
    return next();
  }
  
  // SE HOUVER ERROS MOSTRA PARA O USUARIO
  const extractedErros = [];
  if (req.fileValidationError) {
    extractedErros.push(req.fileValidationError);
  }
  if (erros.array()) {
    erros.array().map((err) => extractedErros.push(err.msg));
  }

  return res.status(422).json({errors: extractedErros});
};

// trata os erros de validações de outros campos
const validate = (req, res, next) => {
  const erros = validationResult(req);
  // sem erros, prossegue

  if (erros.isEmpty() && !req.fileValidationError) {
    return next();
  }
  // caso tenha erros, adiciona-os em uma lista para exibição
  const extractedErros = [];
  if (req.fileValidationError) {
    extractedErros.push(req.fileValidationError);
  }
  if (erros.array()) {
    erros.array().map((err) => extractedErros.push(err.msg));
  }

  return res.status(422).json({errors: extractedErros});
};

module.exports = [validateForm, validate];
