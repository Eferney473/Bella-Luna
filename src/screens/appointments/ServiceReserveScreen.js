// src/screens/appointments/ServiceReserveScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { createBooking } from '../../database/bookingService';

const USER_ID_TEST = "user_ana_123"; // ID simulado temporal

export default function ServiceReserveScreen({ navigation }) {
  // Estados para simular la selección (en el futuro puedes abrir un DateTimePicker)
  const [fecha, setFecha] = useState('20/05/2026');
  const [horario, setHorario] = useState('09:00 AM');
  const precioPorDia = 45000;

  const handleReserve = async () => {
    const nuevaReserva = {
      userId: USER_ID_TEST,
      servicio: 'Guardería',
      mascota: 'Luna', // Vinculado a la mascota del usuario
      fecha: fecha,
      horario: horario,
      precio: precioPorDia
    };

    const exito = await createBooking(nuevaReserva);
    if (exito) {
      Alert.alert(
        "¡Reserva Exitosa!", 
        "Tu cita de Guardería ha sido agendada correctamente.",
        [{ text: "OK", onPress: () => navigation.navigate('Home') }]
      );
    } else {
      Alert.alert("Error", "No se pudo agendar la cita. Inténtalo de nuevo.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guardería</Text>
        <View style={{ width: 40 }} /> {/* Dummy para centrar el título */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- IMAGEN PRINCIPAL --- */}
        <Image 
          source={require('../../assets/guarderia-big.jpg')} 
          style={styles.mainImage}
        />

        {/* --- DESCRIPCIÓN --- */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Cuidado, juego y supervisión en un ambiente seguro y divertido mientras tú estás fuera.
          </Text>
        </View>

        {/* --- FORMULARIO DE SELECCIÓN --- */}
        <View style={styles.formContainer}>
          
          {/* Selector Fecha */}
          <TouchableOpacity style={styles.selectorRow}>
            <View style={styles.selectorLeft}>
              <Text style={styles.icon}>📅</Text>
              <Text style={styles.selectorLabel}>Fecha</Text>
            </View>
            <Text style={styles.selectorValue}>{fecha}  ›</Text>
          </TouchableOpacity>

          {/* Selector Horario */}
          <TouchableOpacity style={styles.selectorRow}>
            <View style={styles.selectorLeft}>
              <Text style={styles.icon}>⏰</Text>
              <Text style={styles.selectorLabel}>Horario</Text>
            </View>
            <Text style={styles.selectorValue}>{horario}  ›</Text>
          </TouchableOpacity>

          {/* Recuadro de Precio */}
          <View style={styles.priceRow}>
            <View style={styles.selectorLeft}>
              <Text style={styles.icon}>ℹ️</Text>
              <Text style={styles.selectorLabel}>Precio por día</Text>
            </View>
            <Text style={styles.priceValue}>${precioPorDia.toLocaleString('es-CO')}</Text>
          </View>

        </View>

        {/* --- BOTÓN DE RESERVA --- */}
        <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
          <Text style={styles.reserveButtonText}>Reservar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    marginTop:30
  },
  backButton: { width: 40, justifyContent: 'center' },
  backText: { fontSize: 32, color: COLORS.textDark, fontWeight: '300' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela, textAlign: 'center', flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Imagen del servicio
  mainImage: { width: '100%', height: 220, resizeMode: 'cover' },

  // Descripción
  descriptionContainer: { paddingHorizontal: 24, paddingVertical: 20 },
  descriptionText: { fontSize: 15, color: COLORS.textMedium, lineHeight: 22, textAlign: 'center' },

  // Formulario / Selectores
  formContainer: { paddingHorizontal: 24, marginBottom: 32 },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 18, marginRight: 12 },
  selectorLabel: { fontSize: 14, color: COLORS.textMedium, fontWeight: '500' },
  selectorValue: { fontSize: 14, color: COLORS.textDark, fontWeight: '600' },

  // Fila especial de precio
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8
  },
  priceValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela },

  // Botón de acción
  reserveButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 24,
    height: 48,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  reserveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});