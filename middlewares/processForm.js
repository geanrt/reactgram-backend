const multer = require("multer");


// PROCESSA O FORMULARIO PARA VALIÇÃO DA PHOTO, ARMAZENANDO A IMAGEM NA MEMORIA RAM
const memoryStorage = multer.memoryStorage();

const processForm = multer({
  storage: memoryStorage,
});


module.exports = processForm;