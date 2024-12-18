import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Favorites1 from './components/Favorites1';

const Stack = createNativeStackNavigator()

const FavoritesStack = () => {
    return(
      <Stack.Navigator initialRouteName='Favorites1'>
        <Stack.Screen name='Favorites1' component={Favorites1} options={{title: 'Favorites'}}/>
  
      </Stack.Navigator>
    )
    
  }

export default FavoritesStack
  