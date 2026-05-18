import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, } from 'react-native';
import { COLORS } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importación de las pantallas reales que controlará el Tab
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PetsScreen from '../screens/pets/PetsScreen';
import AppointmentsScreen from '../screens/appointments/AppointmentsScreen';
import ShopScreen from '../screens/shop/ShopScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // React Navigation manejará estos colores directamente sobre los iconos vectoriales
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight || '#9CA3AF',
        
        // Tu configuración de altura blindada para Android/iOS
        tabBarStyle: {
          backgroundColor: COLORS.white,
          height: Platform.OS === 'ios' ? 100 : 100,
          paddingBottom: Platform.OS === 'ios' ? 30 : 18,
          paddingTop: 2,
          borderTopWidth: 1,
          borderTopColor: COLORS.border || '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        // CONTROL DE ICONOS VECTORIALES PROFESIONALES
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;

          // Seleccionamos el icono basado en la ruta
          // focused ? 'icono-relleno' : 'icono-lineal' (aporta un feedback visual premium)
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Mascotas') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Citas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Tienda') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          // Retornamos el componente nativo de la librería
          return <Ionicons name={iconName} size={size ? size : 24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Mascotas" component={PetsScreen} />
      <Tab.Screen name="Citas" component={AppointmentsScreen} />
      <Tab.Screen name="Tienda" component={ShopScreen} />
    </Tab.Navigator>
  );
}