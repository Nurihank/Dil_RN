export default class UserModel {

    static currentUser = "selamke"

    static setCurrentUser =async (value) => {
        this.currentUser = await value
    } 
    static getCurrentUser = () => {
        return this.currentUser
    }

}

