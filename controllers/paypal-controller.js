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
    const nombrePdf = token +'.pdf';
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
        .then(paypalResponse => {

            generatePdf(pdfHTML)
            .then(pdf => {
                sendMail({
                    to: customer.email,
                    subject: 'Confirmación de compra',
                    text: 'Compra procesada correctamente',
                    html: `
                    <html>

                    <body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
                      <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px green;">
                        <thead>
                          <tr>
                            <th style="text-align:left;"><img style="max-width: 150px;" src="https://www.bachanatours.in/book/img/logo.png" alt="bachana tours"></th>
                            <th style="text-align:right;font-weight:400;">05th Apr, 2017</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style="height:35px;"></td>
                          </tr>
                          <tr>
                            <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                              <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Order status</span><b style="color:green;font-weight:normal;margin:0">Success</b></p>
                              <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Transaction ID</span> abcd1234567890</p>
                              <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Order amount</span> Rs. 6000.00</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="height:35px;"></td>
                          </tr>
                          <tr>
                            <td style="width:50%;padding:20px;vertical-align:top">
                              <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">Name</span> Palash Basak</p>
                              <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Email</span> palash@gmail.com</p>
                              <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Phone</span> +91-1234567890</p>
                              <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">ID No.</span> 2556-1259-9842</p>
                            </td>
                            <td style="width:50%;padding:20px;vertical-align:top">
                              <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Address</span> Khudiram Pally, Malbazar, West Bengal, India, 735221</p>
                              <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Number of gusets</span> 2</p>
                              <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Duration of your vacation</span> 25/04/2017 to 28/04/2017 (3 Days)</p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Items</td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding:15px;">
                              <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;">
                                <span style="display:block;font-size:13px;font-weight:normal;">Homestay with fooding & lodging</span> Rs. 3500 <b style="font-size:12px;font-weight:300;"> /person/day</b>
                              </p>
                              <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">Pickup & Drop</span> Rs. 2000 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
                              <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">Local site seeing with guide</span> Rs. 800 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
                              <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">Tea tourism with guide</span> Rs. 500 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
                              <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">River side camping with guide</span> Rs. 1500 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
                              <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">Trackking and hiking with guide</span> Rs. 1000 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
                            </td>
                          </tr>
                        </tbody>
                        <tfooter>
                          <tr>
                            <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                              <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Bachana Tours<br> Gorubathan, Pin/Zip - 735221, Darjeeling, West bengal, India<br><br>
                              <b>Phone:</b> 03552-222011<br>
                              <b>Email:</b> contact@bachanatours.in
                            </td>
                          </tr>
                        </tfooter>
                      </table>
                    </body>
                    
                    </html>
                    `,
                }, pdf, nombrePdf).then(idMail => {
                    console.log(`Email enviado a '${customer.email}': ${idMail}`);
                    res.send(paypalResponse.data);
    
                }).catch(error => {
    
                    res.status(500).send({ error: error.message });
    
                });
            })
            .catch(err => {
                res.status(500).send({ error: error.message });
            });
            
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