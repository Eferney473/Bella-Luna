import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function ServiceReserveScreen({ route, navigation }) {
  // Capturamos el servicio del Home (ej: 'Guardería' o 'Spa Canino')
  const { servicio } = route.params || { servicio: 'Guardería' };

  // --- ARREGLOS DE DATOS DINÁMICOS SEGÚN EL SERVICIO ---
  const planesGuarderia = [
    { id: 'g1', nombre: 'Plan Bella Luna', desc: 'Estadía 24 horas', icon: 'home-outline' },
    { id: 'g2', nombre: 'Plan Sol', desc: 'Diurno · 6am a 8pm', icon: 'sunny-outline' },
    { id: 'g3', nombre: 'Plan Luna', desc: 'Nocturno · 7pm a 8am', icon: 'moon-outline' },
    { id: 'g4', nombre: 'Plan Salvador', desc: 'Estadía por horas', icon: 'time-outline' },
    { id: 'g5', nombre: 'Mañanas de Parque', desc: 'Mañanas de paseo · 9am a 1pm', icon: 'leaf-outline' },
  ];

  const planesSpa = [
    { id: 's1', nombre: 'Baño Premium', desc: 'Shampoo especial, secado y perfume', icon: 'water-outline' },
    { id: 's2', nombre: 'Corte de Pelo', desc: 'Estilo según raza + baño incluido', icon: 'scissors-outline' },
    { id: 's3', nombre: 'Deslanado', desc: 'Retirado profundo de pelo muerto', icon: 'brush-outline' },
    { id: 's4', nombre: 'Corte de Uñas', desc: 'Perfilado y corte seguro', icon: 'cut-outline' },
    { id: 's5', nombre: 'Limpieza de Oídos', desc: 'Higiene preventiva profunda', icon: 'ear-outline' },
  ];

  // Asignamos la lista de opciones correcta dependiendo de la tarjeta presionada
  const esSpa = servicio === 'Spa Canino' || servicio === 'Spa';
  const opcionesDisponibles = esSpa ? planesSpa : planesGuarderia;

  // --- ESTADOS ---
  const [currentStep, setCurrentStep] = useState(1);
  // Inicializamos el plan seleccionado con el primer elemento de la lista correspondiente
  const [selectedPlan, setSelectedPlan] = useState(opcionesDisponibles[0]?.nombre || '');
  const [selectedPet, setSelectedPet] = useState('Max');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [transportMethod, setTransportMethod] = useState(''); 
  const [isModalVisible, setModalVisible] = useState(false);

  const mascotas = [
    { id: 'm1', nombre: 'Max', desc: 'Golden Retriever · 28kg', icon: 'paw-outline' },
    { id: 'm2', nombre: 'Luna', desc: 'Gato persa · 4kg', icon: 'logo-octocat' },
  ];

  const fechasDias = ['17', '18', '19', '20', '21']; 
  const horarios = ['08:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  // --- FUNCIONES ---
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedPlan || !selectedPet) {
        Alert.alert('Incompleto', 'Por favor selecciona una opción y una mascota.');
        return;
      }
      setCurrentStep(2);
    } else {
      if (!selectedDate || !selectedTime || !transportMethod) {
        Alert.alert('Incompleto', 'Por favor selecciona fecha, hora y método de entrega.');
        return;
      }
      setModalVisible(true); 
    }
  };

  const handleConfirmarReserva = () => {
    setModalVisible(false);
    
    // Asignamos un icono coherente para la lista de Citas
    const iconCita = esSpa ? 'sparkles-outline' : (selectedPlan === 'Mañanas de Parque' ? 'leaf-outline' : 'home-outline');

    const nuevaCita = {
      id: String(Date.now()),
      tipo: 'servicio',
      servicio: `${servicio} (${selectedPlan})`,
      mascota: selectedPet,
      fecha: `${selectedDate} Mayo`,
      hora: selectedTime,
      estado: 'Confirmada',
      icon: iconCita, 
    };

    Alert.alert(
      "¡Cita Agendada!",
      `Tu sesión de ${selectedPlan} para ${selectedPet} ha sido reservada con éxito.`,
      [
        {
          text: "Ver mis citas",
          onPress: () => {
            navigation.navigate('Home', {
              screen: 'Citas',
              params: { nuevaCita: nuevaCita }
            });
          }
        }
      ]
    );
  };

  // --- RENDERIZADO DE PASOS ---
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>{esSpa ? '¿Qué servicio de Estética deseas?' : '¿Qué servicio necesitas?'}</Text>
      {opcionesDisponibles.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[styles.cardOption, selectedPlan === plan.nombre && styles.cardOptionActive]}
          onPress={() => setSelectedPlan(plan.nombre)}
        >
          <View style={[styles.iconBox, selectedPlan === plan.nombre && { backgroundColor: '#F3E8FF' }]}>
             <Ionicons name={plan.icon} size={24} color={selectedPlan === plan.nombre ? COLORS.ciruela : '#9CA3AF'} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, selectedPlan === plan.nombre && { color: COLORS.ciruela }]}>{plan.nombre}</Text>
            <Text style={styles.cardDesc}>{plan.desc}</Text>
          </View>
          {selectedPlan === plan.nombre && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.ciruela} />
          )}
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>¿Para cuál mascota?</Text>
      {mascotas.map((mascota) => (
        <TouchableOpacity
          key={mascota.id}
          style={[styles.cardOption, selectedPet === mascota.nombre && styles.cardOptionActive]}
          onPress={() => setSelectedPet(mascota.nombre)}
        >
           <View style={[styles.iconBox, { backgroundColor: mascota.nombre === 'Max' ? '#E6F4EA' : '#FFF3E0' }]}>
             <Ionicons name={mascota.icon} size={24} color={mascota.nombre === 'Max' ? COLORS.primary : '#F59E0B'} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, selectedPet === mascota.nombre && { color: COLORS.ciruela }]}>{mascota.nombre}</Text>
            <Text style={styles.cardDesc}>{mascota.desc}</Text>
          </View>
           {selectedPet === mascota.nombre && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.ciruela} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Mes de Mayo</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
        {fechasDias.map((dia) => (
          <TouchableOpacity
            key={dia}
            style={[styles.dayCard, selectedDate === dia && styles.dayCardActive]}
            onPress={() => setSelectedDate(dia)}
          >
            <Text style={[styles.dayTextSmall, selectedDate === dia && { color: COLORS.white }]}>Sáb</Text>
            <Text style={[styles.dayTextBig, selectedDate === dia && { color: COLORS.white }]}>{dia}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Hora del turno</Text>
      <View style={styles.timeGrid}>
        {horarios.map((hora) => (
          <TouchableOpacity
            key={hora}
            style={[styles.timeBox, selectedTime === hora && styles.timeBoxActive]}
            onPress={() => setSelectedTime(hora)}
          >
            <Text style={[styles.timeText, selectedTime === hora && { color: COLORS.white, fontWeight: 'bold' }]}>{hora}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>¿Cómo gestionamos el traslado de {selectedPet}?</Text>
      <View style={styles.transportRow}>
        <TouchableOpacity
          style={[styles.transportCard, transportMethod === 'tienda' && styles.transportCardActive]}
          onPress={() => setTransportMethod('tienda')}
        >
          <Ionicons name="storefront-outline" size={24} color={transportMethod === 'tienda' ? COLORS.ciruela : '#6B7280'} />
          <Text style={[styles.transportText, transportMethod === 'tienda' && { color: COLORS.ciruela, fontWeight: 'bold' }]}>Lo llevo a tienda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.transportCard, transportMethod === 'domicilio' && styles.transportCardActive]}
          onPress={() => setTransportMethod('domicilio')}
        >
          <Ionicons name="car-sport-outline" size={24} color={transportMethod === 'domicilio' ? COLORS.ciruela : '#6B7280'} />
          <Text style={[styles.transportText, transportMethod === 'domicilio' && { color: COLORS.ciruela, fontWeight: 'bold' }]}>Recogida y regreso</Text>
          <Text style={styles.transportPrice}>+$15.000</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      
      {/* HEADER DINÁMICO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
            if(currentStep === 2) setCurrentStep(1);
            else navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservar {servicio}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* BARRA DE PROGRESO */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
            <View style={[styles.progressCircle, currentStep >= 1 && styles.progressCircleActive]}>
                <Text style={styles.progressText}>1</Text>
            </View>
            <Text style={[styles.progressLabel, currentStep >= 1 && { color: COLORS.white }]}>Servicio</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
            <View style={[styles.progressCircle, currentStep >= 2 && styles.progressCircleActive]}>
                <Text style={[styles.progressText, currentStep < 2 && { color: '#6B7280' }]}>2</Text>
            </View>
            <Text style={[styles.progressLabel, currentStep >= 2 && { color: COLORS.white }]}>Fecha</Text>
        </View>
      </View>

      {/* CONTENIDO BLANCO */}
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </ScrollView>

        {/* BOTÓN FLOTANTE INFERIOR */}
        <View style={styles.footerContainer}>
            <TouchableOpacity 
                style={styles.mainButton}
                onPress={handleNextStep}
            >
                <Text style={styles.mainButtonText}>
                    {currentStep === 1 ? 'Siguiente' : 'Revisar y Confirmar'}
                </Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM SHEET MODAL DE RESUMEN */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Resumen de tu cita</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <View style={styles.summaryItem}>
                <Ionicons name={esSpa ? "sparkles" : "home"} size={20} color={COLORS.ciruela} style={styles.summaryIcon} />
                <View>
                    <Text style={styles.summaryTitle}>{selectedPlan}</Text>
                    <Text style={styles.summarySub}>{servicio}</Text>
                </View>
            </View>

            <View style={styles.summaryItem}>
                <Ionicons name="paw" size={20} color={COLORS.primary} style={styles.summaryIcon} />
                <View>
                    <Text style={styles.summaryTitle}>{selectedPet}</Text>
                    <Text style={styles.summarySub}>Tu mascota</Text>
                </View>
            </View>

            <View style={styles.summaryItem}>
                <Ionicons name="calendar" size={20} color="#F59E0B" style={styles.summaryIcon} />
                <View>
                    <Text style={styles.summaryTitle}>{selectedDate} de Mayo · {selectedTime}</Text>
                    <Text style={styles.summarySub}>Fecha y Hora</Text>
                </View>
            </View>

            <View style={styles.summaryItem}>
                <Ionicons name={transportMethod === 'domicilio' ? 'car' : 'storefront'} size={20} color="#3B82F6" style={styles.summaryIcon} />
                <View>
                    <Text style={styles.summaryTitle}>{transportMethod === 'domicilio' ? 'Recogida y regreso' : 'Entrega en tienda'}</Text>
                    <Text style={styles.summarySub}>Logística de transporte</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={[styles.mainButton, { marginTop: 20 }]}
                onPress={handleConfirmarReserva}
            >
                <Text style={styles.mainButtonText}>Confirmar turno de Spa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ... Mantienes exactamente los mismos estilos del StyleSheet que ya tenías abajo ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white, textAlign: 'center', flex: 1 },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 40 },
  progressStep: { alignItems: 'center' },
  progressCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  progressCircleActive: { backgroundColor: COLORS.ciruela },
  progressText: { fontSize: 14, fontWeight: 'bold', color: COLORS.white },
  progressLabel: { fontSize: 12, color: '#D1D5DB' },
  progressLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 10, alignSelf: 'flex-start', marginTop: 14 },
  contentWrapper: { flex: 1, backgroundColor: '#F9F9F6', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  stepContainer: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 15 },
  cardOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#ECECE7' },
  cardOptionActive: { borderColor: COLORS.ciruela, borderWidth: 1.5 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  daysScroll: { flexGrow: 0, marginBottom: 20 },
  dayCard: { width: 60, height: 75, backgroundColor: COLORS.white, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#ECECE7' },
  dayCardActive: { backgroundColor: COLORS.ciruela, borderColor: COLORS.ciruela },
  dayTextSmall: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  dayTextBig: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeBox: { width: '31%', backgroundColor: COLORS.white, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#ECECE7' },
  timeBoxActive: { backgroundColor: COLORS.ciruela, borderColor: COLORS.ciruela },
  timeText: { fontSize: 13, color: '#4B5563' },
  transportRow: { flexDirection: 'row', justifyContent: 'space-between' },
  transportCard: { width: '48%', backgroundColor: COLORS.white, padding: 15, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#ECECE7' },
  transportCardActive: { borderColor: COLORS.ciruela, borderWidth: 1.5, backgroundColor: '#FAF5FF' },
  transportText: { fontSize: 13, color: '#4B5563', marginTop: 8, textAlign: 'center' },
  transportPrice: { fontSize: 12, color: '#10B981', fontWeight: 'bold', marginTop: 4 },
  footerContainer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#F9F9F6', padding: 20, borderTopWidth: 1, borderColor: '#ECECE7' },
  mainButton: { backgroundColor: COLORS.ciruela, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  mainButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela },
  summaryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#F9F9F6', padding: 15, borderRadius: 12 },
  summaryIcon: { marginRight: 15 },
  summaryTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  summarySub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});