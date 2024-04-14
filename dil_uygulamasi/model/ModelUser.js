import api from "../api/api"

export default class UserModel {
    
    static currentUser
    static MeslekId
    static DilID
    static SectigiDilId

    static setUser = async (id)=>{
        var response = await api.get("/kullanici/user/"+id)
        this.currentUser =  await response.data   
        /* this.MeslekID =await this.currentUser[0].MeslekID   
        this.DilID = await this.currentUser[0].DilID 
        this.SectigiDilID = await this.currentUser[0].SectigiDilID  */
        console.log("set")
    }
   
    static getCurrentUser = () => {
      //  console.log(this.currentUser)
        console.log("get")
        return  this.currentUser
    }
    /* static getMeslekId = async () => {
        return await this.MeslekID
    }
    static getDilId = async () => {
        return await this.DilID
    }
    static getSectigiDilId = async () => {
        return await this.SectigiDilID
        
    } */

}

