import axios from "axios"
import api from "../api/api"
import React, { useState ,useEffect} from 'react'

export default ({ apiInfo })=>{

    const [result, setresult] = useState([])
    
    const searchApi = async (term)=>{
        const response = await api.get("/kullanici" + apiInfo)
        //console.log(apiInfo)
        setresult(response.data.result)
    }

    useEffect(() => {
        searchApi("")
    }, [])
    
    return[searchApi,result]
} 