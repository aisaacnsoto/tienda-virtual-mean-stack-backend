const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

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

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();

    // Modifica cada producto para que la propiedad "foto" sea una URL completa
    productos.forEach(producto => {
      if (producto.foto) {
        producto.foto = `${req.protocol}://${req.get('host')}/uploads/${path.basename(producto.foto)}`;
      }
    });
    
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', getProduct, (req, res) => {
  res.json(res.producto);
});

// Crear un nuevo producto
router.post('/', upload.single('foto'), async (req, res) => {
  const producto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
    foto: req.file.path
  });

  try {
    const nuevoProducto = await producto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un producto por ID
router.put('/:id', getProduct, async (req, res) => {
  if (req.body.nombre != null) {
    res.producto.nombre = req.body.nombre;
  }
  if (req.body.precio != null) {
    res.producto.precio = req.body.precio;
  }
  if (req.body.descripcion != null) {
    res.producto.descripcion = req.body.descripcion;
  }
  if (req.body.categoria != null) {
    res.producto.categoria = req.body.categoria;
  }

  try {
    const productoActualizado = await res.producto.save();
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto por ID
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.producto.deleteOne();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware para obtener un producto por ID
async function getProduct(req, res, next) {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto == null) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.producto = producto;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = router;
