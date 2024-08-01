# Veteran Services ChatBot
Full-Stack Retrieval-Augmented Generation (RAG) application built to assist veterans. 2024 Summer Intern Project. 

# Overview
Tasked with improving veteran experience on the Manatee County website and finding a way to easier connect veterans to external resources instead the physcial 50+ page resource pamphlets. Veteran Services ChatBot will be utilized to help answer FAQ regarding the Manatee County Veteran Services office and to easily connect veterans to local external agencies in the county.

* Frontend end was built with HTML/CSS and JavaScript. 
* Backend is built with Node.js + Express.js and integrates with LangChain.js + OpenAI API.

# Demo
![demo](https://github.com/user-attachments/assets/fd14b1d2-c5ca-4431-8708-002f11fb86a7)

# How it Works
1. PDF Document Processing:
  * The backend loads the PDF containing county services and external agencies information.
  * The document is split into smaller chunks for better processing and embedding.


2. User-Query Handling:
  * The user interacts with the chatbot through the frontend interface.
  * The user's query is sent to the backend, where it is processed.


3. Information Retrieval and Response Generation:
  * LangChain retrieves relevant chunks of text from the vector store based on the query.
  * The OpenAI model, augmented with the retrieved information, generates a response.
  * The response is sent back to the frontend and displayed to the user.

# Getting Started
  wip





# Acknowledgments
  LangChain.js 
  *  Docs: https://js.langchain.com/v0.2/docs/introduction/
  *  Tutorials: https://www.youtube.com/@leonvanzyl

  UI
  * www.codingnepalweb.com

  API
  * https://openai.com/index/openai-api/
  * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

  Express.js
  * https://expressjs.com/
    
    


