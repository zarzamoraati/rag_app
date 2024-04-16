import "cheerio";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";


class RAGGenerator{
    constructor(combineDocs,vectorDB,parser){
        this.outputParser=parser
        this.vectorDB=vectorDB
        this.combineDocs=combineDocs
        
      
        // generate rag 
        this.generate=async(llm,question,prompt)=>{
            try{
                // chunk
            //console.log(llm)
            const retriever=this.vectorDB.asRetriever()
            const relevant_docs=await retriever._getRelevantDocuments(question)
            const ragChain=await this.combineDocs({
                llm,
                prompt,
                outputParser:this.outputParser
                
            }) 
                return await ragChain.invoke({question,context:relevant_docs})

            }catch(e){
                throw e
            }
                     
        }      
    };
}


export const ragGenerator = async (request) => {
    
    const prompt=new PromptTemplate({
        template:`You are a helpful assistant who provide feedback to the user questions based in the context bellow:\n
        This is the question from the user: {question}\n
        This is the context to respo|nd the answer: {context}\n
        
        Note: Take a moment to analyze the context and use it to respond the question, if the context doesn't provide relevant information related qith the question , respond to the user telling them that you don't have the information to give them an answer
        `,
        inputVariables:["question","context"]
    })
    
    const llm=new ChatGoogleGenerativeAI({
        temperature:0,
        model:"gemini-pro",
        apiKey:import.meta.env.VITE_GOOGLE_API_KEY
    })
    console.log(request.url)
    const combineDocs=createStuffDocumentsChain
    const loader=new CheerioWebBaseLoader(request.url)
    const docs = await loader.load()
    console.log(docs)
    const splitter=new RecursiveCharacterTextSplitter({chunkSize:1000,chunkOverlap:100})
    const chunks=await splitter.splitDocuments(docs)
    const embeddings= new FireworksEmbeddings({apiKey:import.meta.env.VITE_FIREWORK_API_KEY})
    const vectorDB=await MemoryVectorStore.fromDocuments(chunks,embeddings)
    const parser=new StringOutputParser()

    const ragmodel=new RAGGenerator(combineDocs,vectorDB,parser)
    const response=await ragmodel.generate(llm,request.question,prompt)
    return response
    
 
}
