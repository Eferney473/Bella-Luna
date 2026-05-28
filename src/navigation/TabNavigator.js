import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importación de tus pantallas reales
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
        tabBarActiveTintColor: COLORS.primary || '#149284', 
        tabBarInactiveTintColor: '#9CA3AF', 
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#F3F4F6',
          height: 100,
          paddingBottom: 10,
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        // CORRECCIÓN SINTÁCTICA AQUÍ: Definimos de forma limpia la lógica del icono
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'paw'; // Icono por defecto en caso de fallo

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

          // Retornamos explícitamente el componente de Ionicons
          return <Ionicons name={iconName} size={24} color={color} />;
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