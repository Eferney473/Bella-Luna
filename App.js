// App.jsx
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { COLORS } from './src/config/colors';

const App = () => {
  return (
    <NavigationContainer>
      {/* Configuramos la barra de estado del teléfono con tus colores */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Mostramos el flujo de login por defecto */}
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default App;