import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PetsScreen from '../screens/pets/PetsScreen';
import AppointmentsScreen from '../screens/appointments/AppointmentsScreen';
import StoreScreen from '../screens/store/StoreScreen';
import AddPetScreen from '../screens/pets/AddPetScreen';
import BookAppointmentScreen from '../screens/appointments/BookAppointmentScreen';
import CartScreen from '../screens/store/CartScreen';

import { COLORS } from '../config/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
        tabBarStyle: { backgroundColor: COLORS.white },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'account' : 'account-outline';
          else if (route.name === 'Mascotas') iconName = focused ? 'paw' : 'paw-outline';
          else if (route.name === 'Citas') iconName = focused ? 'calendar-month' : 'calendar-month-outline';
          else if (route.name === 'Tienda') iconName = focused ? 'shopping' : 'shopping-outline';

          return <MaterialCommunityIcons name={iconName} size={size + 2} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Mascotas" component={PetsScreen} />
      <Tab.Screen name="Citas" component={AppointmentsScreen} />
      <Tab.Screen name="Tienda" component={StoreScreen} />
    </Tab.Navigator>
  );
}

export default function AuthNavigator({ user }) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isInitializing ? (
        // 1. Mientras inicializa, el Stack solo conoce a Splash
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : !user ? (
        // 2. Flujo Público (Login y Registro)
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        // 3. Flujo Privado
        <Stack.Group>
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="AddPet" component={AddPetScreen} />
          <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}