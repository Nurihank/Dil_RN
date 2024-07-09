import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from "./screens/SignupScreen"
import 'react-native-gesture-handler';
import MeslekEkrani from './screens/SecimEkranları/MeslekEkrani';
import DilEkrani from './screens/SecimEkranları/DilEkrani';
import SectigiDilEkranı from './screens/SecimEkranları/SectigiDilEkranı';
import OnBoardingScreen from './screens/OnBoardingScreen';
import HomeScreen from './screens/HomeScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import Logout from './screens/Logout';
import WelcomeScreen from './screens/WelcomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DilSeviyesiEkrani from './screens/SecimEkranları/DilSeviyesiEkrani';
import SeçimEkrani from './screens/SeçimEkrani';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OnBoarding" component={OnBoardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MeslekEkrani" component={MeslekEkrani} />
        <Stack.Screen name="DilEkrani" component={DilEkrani} />
        <Stack.Screen name="SectigiDilEkranı" component={SectigiDilEkranı} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Logout" component={Logout}  />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="DilSeviyesiEkrani" component={DilSeviyesiEkrani} />
        <Stack.Screen name="SecimEkrani" component={SeçimEkrani} />
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
