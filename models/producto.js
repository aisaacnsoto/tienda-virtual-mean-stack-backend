const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  descripcion: String,
  categoria: String,
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  foto: String,
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
