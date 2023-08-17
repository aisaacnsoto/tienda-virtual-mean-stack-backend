const express = require('express');
const app = express();
const mongoose = require('mongoose');
const productosRouter = require('./routes/productos');
const cors = require('cors');
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

// Configurar Express para aceptar solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Conexión a la base de datos
const mongoURI = 'mongodb+srv://aisaacnsoto:aEte8WbTeJod0AZl@cluster0.dm5rujk.mongodb.net/tienda-virtual-mean-stack';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error en la conexión a MongoDB:', err));

// Rutas de la API
app.use('/api/productos', productosRouter);

// Configurar Express para servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static('uploads'));

// Iniciar el servidor
const port = 3000;
app.listen(port);
