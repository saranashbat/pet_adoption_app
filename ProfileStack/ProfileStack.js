import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Profile1 from './components/Profile1';

const Stack = createNativeStackNavigator()

const ProfileStack = () => {
  return(
    <Stack.Navigator initialRouteName='Profile1'>
      <Stack.Screen name='Profile1' component={Profile1} options={{title: 'Profile'}}/>
  
    </Stack.Navigator>
  )
    
  }

export default ProfileStack
  