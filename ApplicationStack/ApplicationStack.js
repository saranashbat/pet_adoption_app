import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Applications1 from './components/Applications1';
import ApplicationDetails from './components/ApplicationDetails';


const Stack = createNativeStackNavigator()

const ApplicationStack = () => {
    return(
      <Stack.Navigator initialRouteName='Applications1'>
        <Stack.Screen name='Applications1' component={Applications1} options={{ title: 'Applications' }} />
        <Stack.Screen name='ApplicationDetails' component={ApplicationDetails} options={{ title: 'Details' }} />

  
      </Stack.Navigator>
    )
    
  }

export default ApplicationStack
  