import { useEffect, useState } from "react"
import api from "../api/api"

export default () =>{

    const [result, setResult] = useState("")

    const userControl = async(kullaniciAdi,sifre)=>{
        const response = await api.get("signin",{
            params:{
                kullaniciAdi:kullaniciAdi,
                sifre:sifre
            }
        })
        setResult(response)
    }


    useEffect(()=>{
        userControl("")
    },[])

    return[userControl,result]
}