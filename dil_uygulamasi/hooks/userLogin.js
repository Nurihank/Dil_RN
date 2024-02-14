import { useEffect,useState } from "react"
import api from "../api/api"
export default ()=>{

    const [result, setResult] = useState("")

    const userCheck = async(kullaniciAdi,sifre)=>{
        console.log("amk")
        try {
            
            const response = await api.get("/signin", {
                params: {
                    kullaniciAdi: kullaniciAdi,
                    sifre: sifre
                }
    
            })
            setResult(response)
            console.log("asdd")
        } catch (error) {
            console.log(error)
            console.log("mal")
        }
        
    }

    useEffect(()=>{
        userCheck("","")
    },[]) 

    return[userCheck,result]
}