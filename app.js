// Crear aplicación de Express
const express = require('express');
const app = express();

// Configurar Express para recibir data por el body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Express para habilitar el CORS
const cors = require('cors');
app.use(cors());

// Rutas de la API
app.use('/api/productos', require('./routes/productos-routes'));
app.use('/api/payments', require('./routes/paypal-routes'));

// Configurar Express para servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static('uploads'));

// Conexión a la base de datos MongoDB
const connect = require('./config/db-config');
connect();

// Cargar variables de entorno
require('dotenv').config();
const port = process.env.PORT;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Backend corriendo --> ${process.env.BACKEND_URL}`);
});
