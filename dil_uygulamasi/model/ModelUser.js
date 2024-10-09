import api from "../api/api"

export default class UserModel {

    static currentUser
    static MeslekId
    static DilID
    static SectigiDilId

    static setUser = async (id) => {
        try {
            const response = await api.get(`/kullanici/user/${id}`);
            this.currentUser = response.data;
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
 

