import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from "./screens/SignupScreen"
import 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SeçimEkrani from './screens/SeçimEkrani';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavigator from './navigator/BottomNavigator';
import SozlukEkrani from './screens/SozlukEkrani';
import OyunEkrani2 from './screens/OyunEkrani2';
import EgitimScreen from './screens/EgitimScreen';
import TemelEgitimScreen from './screens/TemelEgitim/TemelEgitimScreen.js'
import TemelEgitimOyunScreen from './screens/TemelEgitim/TemelEgitimOyunScreen';
import PremiumScreen from './screens/MagazaScreen';
import HatalarScreen from './screens/Egzersiz/Egzersizler/HatalarScreen';
import EgzersizScreen from './screens/Egzersiz/EgzersizScreen';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="SecimEkrani" component={SeçimEkrani} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Bottom" component={BottomNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Sozluk" component={SozlukEkrani} options={{ headerShown: false }} />
        <Stack.Screen name="OyunEkrani" component={OyunEkrani2} options={{ headerShown: false }} />
        <Stack.Screen name="Egitim" component={EgitimScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TemelEgitimOyun" component={TemelEgitimOyunScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TemelEgitim" component={TemelEgitimScreen} options={{ headerShown: false }} />
        <Stack.Screen name="premium" component={PremiumScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HataScreen" component={HatalarScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
