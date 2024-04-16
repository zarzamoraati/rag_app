import axios from "axios"
const baseURL="https://zarzamoraati.github.io/rag_app/"

const axiosIn=axios.create({
    headers:{
        "Accepts":"application/json",
        "Access-Control-Allow-Origin":"*"
    },
    baseURL:"/api"
})

export default axiosIn