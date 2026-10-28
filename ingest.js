const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

function chunkText(text , chunkSize, overlap) {
  const chunks = [];
  let currentIndex = 0;

  while(currentIndex < text.length) {
    let chunk = text.slice(currentIndex , currentIndex + chunkSize);
    chunks.push(chunk);
 
    currentIndex += (chunkSize- overlap);
  }
  return chunks;
}

async function run() {
    try {
       
        const dataBuffer = fs.readFileSync('2023-24 Financial Statement.pdf');
        
      
        const parser = new PDFParse({ data: dataBuffer });
    
        const result = await parser.getText();
      
        const rawText = result.text;

        //manually chunking the doc
        const docChunk = chunkText(rawText, 1000 , 200);

        console.log(`Success! The PDF was split into ${docChunk.length} chunks.`);
        
        
    } catch (error) {
        console.error("Error parsing the PDF:", error);
    }
}
run()