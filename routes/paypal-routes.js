const paypalController = require('../controllers/paypal-controller');

const express = require('express');
const router = express.Router();

router.post('/create', paypalController.createPayment);
router.post('/execute', paypalController.executePayment);
router.post('/cancel', paypalController.cancelPayment);

module.exports = router;
