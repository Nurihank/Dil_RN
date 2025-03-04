import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from "../services/NavigationService.js"; // ✅ Navigation fonksiyonunu import et

const api = axios.create({
    baseURL: "http://192.168.1.124:3000"
});

api.interceptors.request.use(async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken.replace(/^"|"$/g, '')}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response, // Başarılı yanıtları direkt döndür
    async (error) => {
        if (error.response && error.response.data.message === "Token süresi dolmuş") {
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(error.config); // Orijinal isteği tekrar yap
                }
            } catch (refreshError) {
                console.log("Token yenileme başarısız:", refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    try {
        let refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
            await AsyncStorage.clear();
            navigate("StartScreen"); // ✅ useNavigation yerine NavigationService kullan
            throw new Error("Refresh token not found");
        }

        refreshToken = refreshToken.replace(/^"|"$/g, ''); 
        const userId = await AsyncStorage.getItem("id");

        const response = await axios.put("http://192.168.1.124:3000/kullanici/NewAccessToken", {
            id: userId,
            refreshToken: refreshToken,
        });

        console.log(response.data);
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.log("Access Token yenileme hatası:", error.response?.data?.message || error.message);
        await AsyncStorage.clear();
        navigate("StartScreen"); // ✅ Burada da değiştirdik
        return null;
    }
};

export default api; 