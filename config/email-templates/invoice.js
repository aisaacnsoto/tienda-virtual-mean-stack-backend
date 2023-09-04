const fs = require('fs');
const path = require('path');

const generateInvoiceHTML = (data) => {
    const filePath = path.join(__dirname, 'invoice.html');
    let html = fs.readFileSync(filePath, 'utf-8');
    html = html.replace('%ID%', data.id);
    html = html.replace('%NOMBRE%', data.name);
    html = html.replace('%EMAIL%', data.email);
    html = html.replace('%DESCRIPCION%', data.descripcion);
    html = html.replace('%CANTIDAD%', data.cantidad);
    html = html.replace('%SUBTOTAL%', data.subtotal);
    html = html.replace('%TOTAL%', data.total);

    return html;
}

module.exports = generateInvoiceHTML;