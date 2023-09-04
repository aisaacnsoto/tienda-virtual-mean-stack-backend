require('dotenv').config();

const sendMail = require('../config/emailer-config');
const generatePdf = require('../config/puppeteer-config');
const generateInvoiceHTML = require('../config/email-templates/invoice');
const axios = require('axios');

const auth = {
  username: process.env.PAYPAL_CLIENT_ID,
  password: process.env.PAYPAL_SECRET_KEY
};

const createPayment = (req, res) => {
  const totalCompra = req.body.total;

  const body = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: totalCompra
      }
    }],
    application_context: {
      brand_name: 'Aprendiendo a integrar Paypal con NodeJS',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${process.env.BACKEND_URL}/api/productos/execute-payment`,
      cancel_url: `${process.env.BACKEND_URL}/api/productos/cancel-payment`
    }
  };

  axios.post(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, body, { auth })
    .then(paypalRes => {
      res.send(paypalRes.data);
    })
    .catch(error => {
      res.status(500).send({ error: error.message });
    });

}

const executePayment = (req, res) => {
  const token = req.body.orderID;
  const nombrePdf = token + '.pdf';
  const totalCompra = req.body.total;
  const customer = req.body.customer;

  let pdfHTML = generateInvoiceHTML({
    name: customer.name,
    email: customer.email,
    descripcion: 'Algún producto de la tienda',
    cantidad: '1',
    subtotal: totalCompra,
    total: totalCompra,
  });

  axios.post(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`, {}, { auth })
    .then(async (paypalResponse) => {
      try {
        let pdf = await generatePdf(pdfHTML);

        let idMail = await sendMail({
          to: customer.email,
          subject: 'Confirmación de compra',
          text: 'Compra procesada correctamente',
          html: `Hola ${customer.name}. Tu compra de $${totalCompra} ha sido procesada correctamente. Adjuntamos tu recibo. Muchas gracias por tu preferencia.`,
        }, pdf, nombrePdf);

        console.log(`Email enviado a '${customer.email}' ==> ${idMail}`);

        res.send(paypalResponse.data);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }

    })
    .catch(error => {

      res.status(500).send({ error: error.message });

    });
}

const cancelPayment = (req, res) => {
  res.send({ message: 'El proceso de pago ha sido interrumpido. Regresando al carrito...' });
}

module.exports = {
  createPayment,
  executePayment,
  cancelPayment
}