import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home1 from './components/Home1';
import Category from './components/Category';
import Details from './components/Details';
import Form from './components/Form';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Homepage">
      <Stack.Screen name="Home1" component={Home1} options={{ title: 'Home' }} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Form" component={Form} />
    </Stack.Navigator>
  );
};

//drawer navigator for categories
const HomeStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeDrawer"
      screenOptions={{
        headerShown: true, 
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={MainStack}
        options={{ 
          title: 'Home',
        }}
        
      />
      <Drawer.Screen
        name="Cats"
        component={Category}
        initialParams={{ category: 'cats' }} 
        options={{ 
          title: 'Cats',
          onPress: () => {
            navigation.navigate('Category', { category: 'other' });
          }, 
        }}
      />
      <Drawer.Screen
        name="Dogs"
        component={Category}
        initialParams={{ category: 'dogs' }}
        options={{ 
          title: 'Dogs',
          onPress: () => {
            navigation.navigate('Category', { category: 'dogs' });
          }, 
        }}
      />
      <Drawer.Screen
        name="Other"
        component={Category}
        initialParams={{ category: 'other' }} 
        options={{ 
          title: 'Other',
          onPress: () => {
            navigation.navigate('Category', { category: 'other' });
          }, 
        }}
      />
    </Drawer.Navigator>
  );
};

export default HomeStack;
