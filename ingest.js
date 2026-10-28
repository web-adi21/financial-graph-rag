const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function run() {
    try {
       
        const dataBuffer = fs.readFileSync('2023-24 Financial Statement.pdf');
        
      
        const parser = new PDFParse({ data: dataBuffer });
    
        const result = await parser.getText();
        
        console.log(result.text);
    } catch (error) {
        console.error("Error parsing the PDF:", error);
    }
}

run();