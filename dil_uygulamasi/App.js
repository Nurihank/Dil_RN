import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from "./screens/SignupScreen"
import 'react-native-gesture-handler';
import DrawerScreen from "./navigation/HomeScreen/DrawerScreen"
import GecisEkrani from './screens/GecisEkrani';
import MeslekEkrani from './screens/SecimEkranları/MeslekEkrani';
import DilEkrani from './screens/SecimEkranları/DilEkrani';
import SectigiDilEkranı from './screens/SecimEkranları/SectigiDilEkranı';

export default function App() {

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="GecisEkrani" component={GecisEkrani} />
        <Stack.Screen name="MeslekEkrani" component={MeslekEkrani} />
        <Stack.Screen name="DilEkrani" component={DilEkrani} />
        <Stack.Screen name="SectigiDilEkranı" component={SectigiDilEkranı} />
        <Stack.Screen name="Drawer" component={DrawerScreen} options={{ headerShown: false }} />
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
