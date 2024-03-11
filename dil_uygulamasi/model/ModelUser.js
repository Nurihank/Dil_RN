import api from "../api/api"

export default class UserModel {
    
    static currentUser

    static setUser =async (id)=>{
        var response = await api.get("/user/"+id)
        this.currentUser =  response.data.message
    }
   
    static getCurrentUser = () => {
        return this.currentUser
    }

}

