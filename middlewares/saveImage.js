const path = require("path");
var fs = require("fs");
const {validationResult} = require("express-validator");

const saveImage = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next();
  }
  if (!req.file) {
    // Caso nenhum arquivo tenha sido enviado, retorne um erro
    return next();
  }

  const uploadedFile = req.file;

  let folder = "";
  if (req.baseUrl.includes("users")) {
    folder = "users";
  } else if (req.baseUrl.includes("photos")) {
    folder = "photos";
  }
  const targetDirectory = `uploads/${folder}/`;
  const fileName = Date.now() + path.extname(uploadedFile.originalname)
  const filePath = targetDirectory + fileName;

  fs.writeFile(filePath, uploadedFile.buffer, (err) => {
    if (err) {
      // Se houver algum erro durante a gravação do arquivo, retorne um erro
      return res.status(500).json({error: "Erro ao salvar o arquivo."});

    }

    // Arquivo salvo com sucesso
    req.filename = fileName

    return next();
  });
};

module.exports = saveImage;
