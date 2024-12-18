import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { auth } from './config';

// Importing stacks
import HomeStack from './HomeStack/HomeStack';
import FavoritesStack from './FavoritesStack/FavoritesStack';
import ApplicationStack from './ApplicationStack/ApplicationStack';
import ProfileStack from './ProfileStack/ProfileStack';
import AuthStack from './AuthStack/AuthStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff6d3b',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#dee8fc', height: 80, paddingBottom: 10, paddingTop: 10 },
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} size={40} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" color={color} size={40} />,
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Applications',
          tabBarIcon: ({ color }) => <MaterialIcons name="sticky-note-2" color={color} size={40} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={40} />,
        }}
      />
    </Tab.Navigator>
  );
};

//Main
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStateListener = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return authStateListener;
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
