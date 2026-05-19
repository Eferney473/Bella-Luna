
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ServiceReserveScreen({ route, navigation }) {
  // Capturamos el parámetro enviado. Si por alguna razón no viene ninguno, por defecto será 'Servicio'
  const { servicio } = route.params || { servicio: 'Servicio' };

  // Estados locales para el formulario de agendamiento
  const [selectedPet, setSelectedPet] = useState('Luna');
  const [selectedTime, setSelectedTime] = useState('');

  const horarios = ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'];

  const handleConfirmarReserva = () => {
    // Creamos el objeto de la nueva cita simulada con los datos elegidos
  const nuevaCita = {
    id: String(Date.now()), // ID único temporal
    tipo: 'servicio',
    servicio: servicio,
    mascota: selectedPet,
    fecha: '20 Mayo', // Fecha fija simulada
    hora: selectedTime,
    estado: 'Confirmada',
    icon: servicio === 'Guardería' || servicio === 'Guardería por Día' ? 'home-outline' : servicio === 'Spa' ? 'sparkles-outline' : 'walk-outline',
  };

    Alert.alert(
      "¡Reserva Exitosa!",
      `Tu cita para ${servicio} ha sido agendada correctamente de manera simulada.`,
      [
        { 
          text: "OK", 
          onPress: () => { navigation.navigate('Home', { 
            screen: 'Citas', 
            params: { nuevaCita: nuevaCita}
           });
        }
      }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* --- HEADER CON BOTÓN ATRÁS --- */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.ciruela} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservar {servicio}</Text>
        <View style={{ width: 40 }} /> {/* Espaciador para centrar el título */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* --- EXPLICACIÓN DEL SERVICIO DINÁMICO --- */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>
            Estás agendando una sesión de <Text style={{ fontWeight: 'bold' }}>{servicio}</Text> para tu consentido en Bell Luna.
          </Text>
        </View>

        {/* --- SELECCIÓN DE MASCOTA --- */}
        <Text style={styles.sectionLabel}>1. Selecciona la mascota</Text>
        <View style={styles.petSelectorRow}>
          <TouchableOpacity 
            style={[styles.petOption, selectedPet === 'Luna' && styles.petOptionActive]}
            onPress={() => setSelectedPet('Luna')}
          >
            <Text style={[styles.petOptionText, selectedPet === 'Luna' && styles.petOptionTextActive]}>
              🐶 Luna
            </Text>
          </TouchableOpacity>
          
          {/* Opción deshabilitada para simular el diseño */}
          <TouchableOpacity style={[styles.petOption, { opacity: 0.5 }]} disabled>
            <Text style={styles.petOptionText}>+ Otra</Text>
          </TouchableOpacity>
        </View>

        {/* --- SELECCIÓN DE FECHA (SIMULADA) --- */}
        <Text style={styles.sectionLabel}>2. Fecha de la cita</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => Alert.alert("Calendario", "Aquí se abriría el selector de fecha nativo.")}>
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          <Text style={styles.pickerButtonText}>Seleccionar Día (Ej: 20 de Mayo)</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* --- SELECCIÓN DE HORA --- */}
        <Text style={styles.sectionLabel}>3. Selecciona el horario disponible</Text>
        <View style={styles.timeGrid}>
          {horarios.map((hora) => {
            const isSelected = selectedTime === hora;
            return (
              <TouchableOpacity
                key={hora}
                style={[styles.timeCard, isSelected && styles.timeCardActive]}
                onPress={() => setSelectedTime(hora)}
              >
                <Text style={[styles.timeCardText, isSelected && styles.timeCardTextActive]}>
                  {hora}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* --- BOTÓN DE CONFIRMACIÓN --- */}
        <TouchableOpacity 
          style={[styles.confirmButton, !selectedTime && styles.confirmButtonDisabled]}
          onPress={handleConfirmarReserva}
          disabled={!selectedTime}
        >
          <Text style={styles.confirmButtonText}>Confirmar Reservación</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela, textAlign: 'center', flex: 1 },
  
  scrollContainer: { padding: 20, paddingBottom: 40 },
  
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E6F4EA',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  infoText: { fontSize: 14, color: '#137333', flex: 1, lineHeight: 20 },
  
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 12, marginTop: 12 },
  
  // Selector Mascota
  petSelectorRow: { flexDirection: 'row', marginBottom: 20 },
  petOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  petOptionActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary || '#149284',
    borderWidth: 1,
  },
  petOptionText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  petOptionTextActive: { color: COLORS.primary || '#149284', fontWeight: 'bold' },
  
  // Picker simulado
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  pickerButtonText: { flex: 1, marginLeft: 10, fontSize: 14, color: '#374151' },
  
  // Grilla Horarios
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  timeCard: {
    width: '47%',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeCardActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary || '#149284',
  },
  timeCardText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  timeCardTextActive: { color: COLORS.primary || '#149284', fontWeight: 'bold' },
  
  // Botón Acción
  confirmButton: {
    backgroundColor: COLORS.primary || '#149284',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  confirmButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});