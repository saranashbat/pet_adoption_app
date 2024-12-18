import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Login from './components/Login';
import Register from './components/Register';


const Stack = createNativeStackNavigator()

const AuthStack = () => {
    return(
      <Stack.Navigator initialRouteName='Login' >
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={Register}  />

  
      </Stack.Navigator>
    )
    
  }

export default AuthStack
  