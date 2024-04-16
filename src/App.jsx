import React, { useState } from 'react'
import { ragGenerator } from './hooks/ragGenerator'
import FileUploader from './components/FileUploader'
const App = () => {
    const [response,setResponse]=useState("")
    const [request,setRequest]=useState({question:"",url:""})
    // const [question,setQuestion]=useState("")
    // const [blob,setBlob]=useState(null)
    const [error,setError]=useState("")
    
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError("")
        if(!request.question || !request.url){
            const errorRequest=new Error("Fields in the request can't be empty")
            setError(errorRequest)
        }else{
            try{
                const res = await ragGenerator(request)
                setResponse(res)
                // setRequest({...request,question:"",url:null})
                setQuestion("")
                setBlob(null)
            }catch(e){
                console.log(e)
                setError(e.message)
            }
        }
    }

    const handleChange=(e)=>{
        const {name,value}=e.target
        setRequest({
            ...request,
            [name]:value
        })
    }
    console.log(request)
    // const handleFileChangePDF = (file) => {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       const arrayBuffer = reader.result;
    //       const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    //       setBlob(blob)
    //     };
    //     reader.readAsArrayBuffer(file);
    //   };

    // const handleChangeQuestion=(e)=>{
    //     const {value}=e.target
    //     setQuestion(value)
    // }
  return (
    <div>
        <form
        onSubmit={e=>handleSubmit(e)}
        >
            <input
            name="question"
            placeholder='Enter your question'
            value={request.question}
            onChange={(e)=>handleChange(e)} 
            type="text" />
            <input 
            value={request.url}
            name="url"
            onChange={(e)=>handleChange(e)}
            type="text" />


             {/* <h1>PDF Blob Converter</h1>
            <FileUploader onFileChange={handleFileChangePDF} />
            {blob && (
                <div>
                <h2>PDF Blob</h2>
                <p>{blob.size} bytes</p>
                <p>Type: {blob.type}</p>
                </div>
            )}
            <input
            type="text"
            value={question}
            placeholder='Input your question'
            onChange={e=>handleChangeQuestion(e)}
            ></input> */}
            <button
        
            >
                SEND
            </button>
        </form>
    
        {response ? response:"APP"}
    </div>
  )
}

export default App