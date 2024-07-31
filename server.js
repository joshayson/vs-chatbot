// Import necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Use CORS middleware to enable cross-origin requests
app.use(cors());

// Initialize the OpenAI model
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
});

// Load the PDF document
const loader = new PDFLoader("./vs-connect.pdf", {
    splitPages: false,
});

// Asynchronous function to initialize the server
const initializeServer = async () => {
    try {
        // Load documents from the PDF file
        const docs = await loader.load();
        console.log('Documents loaded successfully.');

        // Split documents into smaller chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunksize: 200,
            chunkOverlap: 50,
        });
        const splitDocs = await splitter.splitDocuments(docs);
        console.log('Documents split successfully.');

        // Generate embeddings for the document chunks
        const embeddings = new OpenAIEmbeddings();
        const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
        console.log('Vector store created successfully.');

        // Create a prompt template for the chat model
        const prompt = ChatPromptTemplate.fromTemplate(`
            Answer the user's question.  
            Context: {context}
            Question: {input}
        `);

        // Create a document chain using the chat model and prompt
        const chain = await createStuffDocumentsChain({
            llm: model,
            prompt,
        });
        console.log('Document chain created successfully.');

        // Create a retriever from the vector store
        const retriever = vectorStore.asRetriever({ k: 4 });

        // Create a retrieval chain using the document chain and retriever
        const retrievalChain = await createRetrievalChain({
            combineDocsChain: chain,
            retriever,
        });
        console.log('Retrieval chain created successfully.');

        // Define the /chat endpoint for handling chat requests
        app.post('/chat', async (req, res) => {
            try {
                const userMessage = req.body.message;
                console.log('Received message:', userMessage);

                if (!userMessage) {
                    return res.status(400).json({ message: "No message provided" });
                }

                // Invoke the retrieval chain with the user's message
                const response = await retrievalChain.invoke({ input: userMessage });
                console.log('Chain response:', response);

                // Check for the answer field in the response
                if (response && response.answer) {
                    res.json({ message: response.answer });
                } else {
                    console.log('Response answer is undefined:', response);
                    res.status(500).json({ message: "Internal error: Response answer is undefined" });
                }
            } catch (error) {
                console.error('Error handling /chat request:', error);
                res.status(500).json({ message: "Internal server error", error: error.message });
            }
        });

        // Start the server on the specified port
        const PORT = process.env.PORT || 5500;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Error initializing server:', error.message);
    }
};

// Call the initializeServer function to set up the server
initializeServer();
