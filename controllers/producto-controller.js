require('dotenv').config();

const path = require('path');

const Producto = require('../models/producto');

const getProducts = async (req, res) => {
    try {
        const productos = await Producto.find();

        // Modifica cada producto para que la propiedad "foto" sea una URL completa
        productos.forEach(producto => {
            if (producto.foto) {
                producto.foto = `${process.env.BACKEND_URL}/uploads/${path.basename(producto.foto)}`;
            }
        });

        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduct = (req, res) => {
    res.json(res.producto);
};

const createProduct = async (req, res) => {
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
};

const updateProduct = async (req, res) => {
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
};

const deleteProduct = async (req, res) => {
    try {
        await res.producto.deleteOne();
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Middleware para obtener un producto por ID
const productMiddleware = async (req, res, next) => {
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
};

module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    productMiddleware
};