const {OllamaEmbeddings} = require("@langchain/ollama");
const {MongoDBAtlasVectorSearch} = require("@langchain/mongodb");
const {MongoClient} = require("mongodb");

const mongoUri = "mongodb+srv://ce4052025_db_user:a2fnRRp0lIG4GXd6@graphrag.ly0yyez.mongodb.net/";
const client = new MongoClient(mongoUri);

async function runQuery() {
  try{
    await client.connect();
    const collection = client.db("ghraphrag").collection("documents");

    const embeddings = new OllamaEmbeddings({
      model:"nomic-embed-text",
      baseUrl:"http://localhost:11434"
    });
    
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection: collection,
      indexName:"vector_index",
      textKey:"text",
      embeddingKey:"embedding",
    });

    const question = "What are the primary financial risks or uncertainties mentioned?";
    const result = await vectorStore.similaritySearch(question,2);

    console.log("--- TOP MATCH 1 ---");
        console.log(results[0].pageContent);
        console.log("\n--- TOP MATCH 2 ---");
        console.log(results[1].pageContent);
  } catch (error) {
    console.log("Query Error: ", error);
  } finally{
    await client.close();
  }
  
}