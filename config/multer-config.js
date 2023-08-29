// Importa librerías necesarias para manejar la subida de las fotos
const multer = require('multer');
const path = require('path');

// Configura el almacenamiento de los archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Crea el middleware de multer para la subida de archivos
const upload = multer({ storage: storage });

module.exports = upload;