import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// PANTALLAS DE AUTENTICACIÓN
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// NAVEGACIÓN PRINCIPAL
import TabNavigator from './TabNavigator';

// PANTALLAS DE DETALLE
import PetDetailScreen from '../screens/pets/PetDetailScreen';
import ServiceReserveScreen from '../screens/appointments/ServiceReserveScreen';
// import ShopScreen from '../screens/shop/ShopScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* Flujo de Autenticación */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Flujo Principal de la App (Barra de navegación inferior) */}
      <Stack.Screen name="Home" component={TabNavigator} />

      {/* Abre la ficha técnica de la mascota (ej: Luna) */}
      <Stack.Screen name="DetalleMascota" component={PetDetailScreen} />

      {/* Pantalla genérica o específica para agendar Guardería, Spa o Paseos */}
      <Stack.Screen name="ReservarServicio" component={ServiceReserveScreen} />
      {/* <Stack.Screen name="Tienda" component={ShopScreen} /> */}
      
    </Stack.Navigator>
  );
}