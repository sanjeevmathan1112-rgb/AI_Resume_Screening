const fs = require('fs');
const pdfParseModule = require('pdf-parse');

exports.extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    if (typeof pdfParseModule === 'function') {
      const data = await pdfParseModule(dataBuffer);
      return data.text || '';
    } else if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
      return result.text || '';
    } else if (pdfParseModule.default && typeof pdfParseModule.default === 'function') {
      const data = await pdfParseModule.default(dataBuffer);
      return data.text || '';
    } else {
      throw new Error('Unsupported pdf-parse export structure');
    }
  } catch (err) {
    console.error('PDF extraction error:', err);
    throw new Error('Error extracting text from PDF: ' + err.message);
  }
};
