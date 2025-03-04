import api from "../api/api"

export default class UserModel {

    static currentUser

    static setUser = async (id) => {
        console.log("set etme id'si "+id)
        try {
            const response = await api.get(`/kullanici/user/${id}`);
            this.currentUser = response.data;
            console.log(response.data)
        } catch (error) {
            console.error("Kullanıcı verisi alınırken bir hata oluştu:", error);
        }
    }
 
    static getCurrentUser = () => {
        if (!this.currentUser) {
            console.warn("Henüz kullanıcı verisi yüklenmedi.");
            return null;
        }
        return this.currentUser;
    }
}
 

