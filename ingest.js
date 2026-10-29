const fs = require('fs');
const pdf = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');

async function run() {
    try {
        const dataBuffer = fs.readFileSync('2023-24 Financial Statement.pdf');
        

        const data = await pdf(dataBuffer); 
        const rawText = data.text;
        

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        

        const docs = await splitter.createDocuments([rawText]);
        
        
        console.log(`Success! LangChain split the PDF into ${docs.length} documents.`);
        console.log("--- HERE IS CHUNK 1 ---");
        console.log(docs[0]);
        
    } catch (error) {
        console.error("Error parsing the PDF:", error);
    }
}

run();