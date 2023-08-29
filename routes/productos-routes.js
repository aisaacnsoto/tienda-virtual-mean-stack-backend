const productoController = require('../controllers/producto-controller');
const getProduct = productoController.productMiddleware;
const upload = require('../config/multer-config');

const express = require('express');
const router = express.Router();

router.get('/', productoController.getProducts);
router.get('/:id', getProduct, productoController.getProduct);
router.post('/', upload.single('foto'), productoController.createProduct);
router.put('/:id', getProduct, productoController.updateProduct);
router.delete('/:id', getProduct, productoController.deleteProduct);

module.exports = router;
