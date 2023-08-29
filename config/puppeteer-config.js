const puppeteer = require('puppeteer');


const generatePdf = async (html) => {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    //Get HTML content from HTML file
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // Downlaod the PDF
    const pdf = await page.pdf({
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        printBackground: true,
        format: 'A4',
    });

    // Close the browser instance
    await browser.close();

    return pdf;
}

module.exports = generatePdf;