import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { COLORS } from '../config/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Menu de pestañas inferiores (Tab Bar)
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { height: 60, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Perfil') iconName = 'user';
          else if (route.name === 'Mascotas') iconName = 'github'; // O cualquier icon de huella
          else if (route.name === 'Citas') iconName = 'calendar';
          else if (route.name === 'Tienda') iconName = 'shopping-cart';

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={HomeScreen} /> 
      <Tab.Screen name="Mascotas" component={HomeScreen} />
      <Tab.Screen name="Citas" component={HomeScreen} />
      <Tab.Screen name="Tienda" component={HomeScreen} />
    </Tab.Navigator>
  );
};

// Stack principal
export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
    </Stack.Navigator>
  );
};