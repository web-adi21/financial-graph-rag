const fs = require('fs');
const pdf = require('pdf-parse'); // Using the stable v1 import
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');

async function run() {
    try {
        const dataBuffer = fs.readFileSync('2023-24 Financial Statement.pdf');
        
        // 1. Extract text using the stable v1 function
        const data = await pdf(dataBuffer); 
        const rawText = data.text;
        
        // 2. Initialize LangChain's Text Splitter
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        
        // 3. Convert the raw text into LangChain Document objects
        const docs = await splitter.createDocuments([rawText]);
        
        // 4. Log the results to verify
        console.log(`Success! LangChain split the PDF into ${docs.length} documents.`);
        console.log("--- HERE IS CHUNK 1 ---");
        console.log(docs[0]);
        
    } catch (error) {
        console.error("Error parsing the PDF:", error);
    }
}

run();