const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const fs = require('fs');
const pdf = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const {  OllamaEmbeddings } = require("@langchain/ollama");
const {MongoClient} = require("mongodb");

const mongoUri = "mongodb+srv://ce4052025_db_user:a2fnRRp0lIG4GXd6@graphrag.ly0yyez.mongodb.net/";
const mongoClient = new MongoClient(mongoUri);

async function run() {
    try {

      await mongoClient.connect();
      const collection = mongoClient.db("graphrag").collection("documents");

      console.log("1 --> PDF Parsing...");
        const dataBuffer = fs.readFileSync('2023-24 Financial Statement.pdf');
        const data = await pdf(dataBuffer); 
        const rawText = data.text;
        
      console.log("2 --> Text Chunking....");
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = await splitter.createDocuments([rawText]);
        
        console.log("3.Generating local embeddings and saving to MongoDB Atlas...");

        const embeddings = new OllamaEmbeddings({
          model: "nomic-embed-text",
          baseUrl: "http://localhost:11434"
        });

        await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, {
          collection: collection,
          indexName: "vector_index",
          textKey: "text",
          embeddingKey: "embedding",
        });
        
        console.log(`Success! ${docs.length} vectors have been saved to MongoDB.`)
    } catch (error) {
        console.error("Error parsing the PDF:", error);
    } finally {
      await mongoClient.close();
    }
}

run();