// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, Platform, View } from 'react-native';
import { COLORS } from '../theme/colors';

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
        headerShown: false, // Requisito del cliente: Sin toolbar superior nativo
        tabBarActiveTintColor: COLORS.primary, // Menta para el seleccionado
        tabBarInactiveTintColor: COLORS.textLight, // Gris para los inactivos
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        // Agregamos 'size' para evitar el warning de desestructuración incompleta
        tabBarIcon: ({ color, focused, size }) => {
          let icon = '•';
          if (route.name === 'Inicio') icon = '🏠';
          if (route.name === 'Perfil') icon = '👤';
          if (route.name === 'Mascotas') icon = '🐾';
          if (route.name === 'Citas') icon = '📅';
          if (route.name === 'Tienda') icon = '🛒';
          
          return (
            <View style={styles.iconContainer}>
              <Text style={[styles.tabIcon, { color: color, fontSize: focused ? 22 : 19 }]}>
                {icon}
              </Text>
            </View>
          );
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    // Se corrige a 65 en Android para evitar desbordes y paddings inválidos
    height: Platform.OS === 'ios' ? 88 : 110, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8, // Sombra sutil en Android
    shadowColor: '#000', // Sombra sutil en iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabLabel: {
    fontSize: 11, // Un punto menos para asegurar que nunca se corte el texto
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    textAlign: 'center',
  }
});