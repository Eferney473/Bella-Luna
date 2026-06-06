import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Platform, StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

export default function BookAppointmentScreen({ route, navigation }) {
  // Capturamos parámetros de navegación: iniciales o de edición externa
  const { initialService, editingAppointment } = route.params || {};

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  
  // Si estamos editando, inicializamos con los valores guardados de la cita
  const [mainService, setMainService] = useState(editingAppointment ? editingAppointment.service : (initialService || 'Guardería')); 
  const [selectedPlan, setSelectedPlan] = useState(editingAppointment ? editingAppointment.subPlan : (mainService === 'Guardería' ? 'Plan Bella Luna' : 'Baño Premium')); 
  const [transportType, setTransportType] = useState(editingAppointment ? (editingAppointment.transport?.includes('tienda') ? 'tienda' : 'recogida') : 'tienda'); 
  
  // Estados para DatePicker
  const [dateObject, setDateObject] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Strings formateados para guardar en Firestore y pintar en pantalla
  const [dateText, setDateText] = useState(editingAppointment ? editingAppointment.date : '');
  const [timeText, setTimeText] = useState(editingAppointment ? editingAppointment.time : '');

  const [loading, setLoading] = useState(false);
  const [loadingPets, setLoadingPets] = useState(true);

  const daycarePlans = [
    { id: 'p1', name: 'Plan Bella Luna', desc: 'Estadía 24 horas', icon: 'home-heart' },
    { id: 'p2', name: 'Plan Sol', desc: 'Diurno • 6am a 8pm', icon: 'white-balance-sunny' },
    { id: 'p3', name: 'Plan Luna', desc: 'Nocturno • 7pm a 8am', icon: 'weather-night' },
    { id: 'p4', name: 'Plan Salvador', desc: 'Estadía por horas', icon: 'clock-outline' },
    { id: 'p5', name: 'Mañanas de Parque', desc: 'Mañanas de paseo • 9am a 1pm', icon: 'leaf' },
  ];

  const spaPlans = [
    { id: 's1', name: 'Baño Premium', desc: 'Shampoo especial, secado y perfume', icon: 'water' },
    { id: 's2', name: 'Corte de Pelo', desc: 'Estilo según raza + baño incluido', icon: 'help-circle-outline' },
    { id: 's3', name: 'Deslanado', desc: 'Retirado profundo de pelo muerto', icon: 'brush' },
    { id: 's4', name: 'Corte de Uñas', desc: 'Perfilado y corte seguro', icon: 'content-cut' },
    { id: 's5', name: 'Limpieza de Oídos', desc: 'Higiene preventiva profunda', icon: 'ear-hearing' },
  ];

  useEffect(() => {
    if (route.params?.initialService && !route.params?.editingAppointment) {
      setMainService(route.params.initialService);
      setSelectedPlan(route.params.initialService === 'Guardería' ? 'Plan Bella Luna' : 'Baño Premium');
    }
  }, [route.params]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection('pets')
      .where('ownerId', '==', currentUser.uid)
      .onSnapshot(querySnapshot => {
        const petsList = [];
        if (querySnapshot) {
          querySnapshot.forEach(doc => {
            petsList.push({ id: doc.id, ...doc.data() });
          });
        }
        setPets(petsList);
        
        if (petsList.length > 0) {
          if (editingAppointment) {
            const matchPet = petsList.find(p => p.id === editingAppointment.petId);
            setSelectedPet(matchPet || petsList[0]);
          } else {
            setSelectedPet(petsList[0]);
          }
        }
        setLoadingPets(false);
      }, error => {
        console.error(error);
        setLoadingPets(false);
      });

    return () => unsubscribe();
  }, [editingAppointment]);

  const handleServiceChange = (service) => {
    setMainService(service);
    setSelectedPlan(service === 'Guardería' ? 'Plan Bella Luna' : 'Baño Premium');
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObject(selectedDate);
      const options = { weekday: 'short', day: 'numeric', month: 'long' };
      const formattedDate = selectedDate.toLocaleDateString('es-ES', options);
      setDateText(formattedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setDateObject(selectedTime);
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      const formattedTime = selectedTime.toLocaleTimeString('es-ES', options);
      setTimeText(formattedTime);
    }
  };

  const handleBook = async () => {
    if (!selectedPet || !dateText || !timeText) {
      Alert.alert('Campos incompletos', 'Por favor selecciona la mascota, la fecha y la hora del servicio.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth().currentUser;

      const appointmentData = {
        ownerId: currentUser.uid,
        petId: selectedPet.id,
        petName: selectedPet.name,
        service: mainService,
        subPlan: selectedPlan,
        transport: transportType === 'tienda' ? 'Llevar a la tienda' : 'Recogida y Regreso a Casa',
        costDetails: transportType === 'tienda' ? 'Costo Estándar Plan' : 'Costo Plan + Recargo de Transporte',
        date: dateText,
        time: timeText,
        status: editingAppointment ? editingAppointment.status : 'Confirmado',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (editingAppointment) {
        await firestore().collection('appointments').doc(editingAppointment.id).update(appointmentData);
        Alert.alert('¡Cita Actualizada!', `Los cambios para la cita de ${selectedPet.name} fueron guardados.`);
      } else {
        appointmentData.createdAt = firestore.FieldValue.serverTimestamp();
        await firestore().collection('appointments').add(appointmentData);
        Alert.alert('¡Reserva Exitosa!', `Tu cita de ${mainService} (${selectedPlan}) para ${selectedPet.name} ha sido registrada.`);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al procesar la reserva.');
    } finally {
      setLoading(false);
    }
  };

  const currentPlans = mainService === 'Guardería' ? daycarePlans : spaPlans;

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#5ECCD3" barStyle="light-content" />
      
      {/* HEADER CORREGIDO: Más amplio hacia abajo y a salvo del notch/iconos de estado */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>
          {editingAppointment ? `Editar ${mainService}` : `Reservar ${mainService}`}
        </Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* INTERRUPTOR PRINCIPAL: GUARDERÍA O SPA */}
        <Text style={styles.sectionLabel}>¿Qué tipo de servicio buscas?</Text>
        <View style={styles.mainToggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleTab, mainService === 'Guardería' && styles.toggleTabActive]}
            onPress={() => handleServiceChange('Guardería')}
          >
            <MaterialCommunityIcons name="home-heart" size={20} color={mainService === 'Guardería' ? COLORS.white : COLORS.textMedium} />
            <Text style={[styles.toggleTabText, mainService === 'Guardería' && styles.toggleTabTextActive]}>Guardería</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleTab, mainService === 'Spa' && styles.toggleTabActive]}
            onPress={() => handleServiceChange('Spa')}
          >
            <MaterialCommunityIcons name="shower" size={20} color={mainService === 'Spa' ? COLORS.white : COLORS.textMedium} />
            <Text style={[styles.toggleTabText, mainService === 'Spa' && styles.toggleTabTextActive]}>Spa Canino</Text>
          </TouchableOpacity>
        </View>

        {/* LISTADO DE SUB-PLANES */}
        <Text style={styles.sectionLabel}>¿Qué plan necesitas?</Text>
        {currentPlans.map((plan) => {
          const isSelected = selectedPlan === plan.name;
          return (
            <TouchableOpacity 
              key={plan.id} 
              style={[styles.planCard, isSelected && styles.planCardSelected]}
              onPress={() => setSelectedPlan(plan.name)}
            >
              <View style={[styles.planIconCircle, isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <MaterialCommunityIcons name={plan.icon} size={22} color={isSelected ? COLORS.ciruela : COLORS.primary} />
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, isSelected && styles.textSelectedStyle]}>{plan.name}</Text>
                <Text style={[styles.planDesc, isSelected && styles.textSelectedStyleLight]}>{plan.desc}</Text>
              </View>
              {isSelected && (
                <View style={styles.checkCircle}>
                  <MaterialCommunityIcons name="check" size={14} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* MODULO DE RECOGIDA / ENTREGA */}
        <Text style={styles.sectionLabel}>Logística de Transporte</Text>
        <View style={styles.transportContainer}>
          <TouchableOpacity 
            style={[styles.transportOption, transportType === 'tienda' && styles.transportOptionActive]}
            onPress={() => setTransportType('tienda')}
          >
            <MaterialCommunityIcons name="storefront-outline" size={24} color={transportType === 'tienda' ? COLORS.white : COLORS.textMedium} />
            <Text style={[styles.transportTitle, transportType === 'tienda' && { color: COLORS.white }]}>Llevar a la tienda</Text>
            <Text style={[styles.transportSubtitle, transportType === 'tienda' && { color: '#E2E8F0' }]}>Sin costo adicional</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.transportOption, transportType === 'recogida' && styles.transportOptionActive, transportType === 'recogida' && { backgroundColor: COLORS.secondary }]}
            onPress={() => setTransportType('recogida')}
          >
            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={transportType === 'recogida' ? COLORS.white : COLORS.textMedium} />
            <Text style={[styles.transportTitle, transportType === 'recogida' && { color: COLORS.white }]}>Recogida y Regreso</Text>
            <Text style={[styles.transportSubtitle, transportType === 'recogida' && { color: '#E2E8F0' }]}>Aplica cargo extra</Text>
          </TouchableOpacity>
        </View>

        {/* SELECCIONAR MASCOTA RESPONSIVA */}
        <Text style={styles.sectionLabel}>¿Para cuál mascota?</Text>
        {loadingPets ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : pets.length === 0 ? (
          <TouchableOpacity style={styles.noPetsBox} onPress={() => navigation.navigate('Mascotas')}>
            <Text style={styles.noPetsText}>Registra un peludito en la pestaña de Mascotas para poder continuar.</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.petsSelectorRow}>
            {pets.map(pet => {
              const isPetSelected = selectedPet?.id === pet.id;
              return (
                <TouchableOpacity 
                  key={pet.id} 
                  style={[styles.petChip, isPetSelected && styles.petChipActive]}
                  onPress={() => setSelectedPet(pet)}
                >
                  <MaterialCommunityIcons name="paw" size={16} color={isPetSelected ? COLORS.white : COLORS.primary} />
                  <Text style={[styles.petChipText, isPetSelected && { color: COLORS.white }]}>{pet.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* FECHA Y HORA */}
        <Text style={styles.sectionLabel}>Fecha y Hora del Servicio</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity style={styles.pickerFieldButton} onPress={() => setShowDatePicker(true)}>
            <MaterialCommunityIcons name="calendar" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerFieldText, !dateText && { color: '#A0AEC0' }]}>
              {dateText || "Elegir Fecha"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickerFieldButton} onPress={() => setShowTimePicker(true)}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerFieldText, !timeText && { color: '#A0AEC0' }]}>
              {timeText || "Elegir Hora"}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateObject}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={dateObject}
            mode="time"
            display="default"
            is24Hour={false}
            onChange={onTimeChange}
          />
        )}

        {/* BOTÓN CON CORRECCIÓN DE DISTANCIA AL BORDE DE LA PANTALLA */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleBook} disabled={loading || pets.length === 0}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>{editingAppointment ? "Guardar Cambios" : "Confirmar Reserva"}</Text>}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  /* ESTILOS DEL HEADER OPTIMIZADO */
  customHeader: { 
    backgroundColor: '#70C1B3', 
    paddingTop: Platform.OS === 'ios' ? 55 : 45, // Evita colisión con los iconos del celular
    paddingBottom: 28, // Mayor amplitud hacia abajo
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24 
  },
  backButton: { marginRight: 15 },
  customHeaderTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 20 },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', color: COLORS.ciruela, marginTop: 18, marginBottom: 12 },
  mainToggleContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4, marginBottom: 5 },
  toggleTab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  toggleTabActive: { backgroundColor: COLORS.primary },
  toggleTabText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: COLORS.textMedium },
  toggleTabTextActive: { color: COLORS.white },
  planCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, padding: 14, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EDF2F7', elevation: 1 },
  planCardSelected: { backgroundColor: '#FAF5FF', borderColor: COLORS.ciruela, borderWidth: 1.5 },
  planIconCircle: { width: 40, height: 40, backgroundColor: '#EDF2F7', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  planInfo: { flex: 1, marginLeft: 15 },
  planName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textDark },
  planDesc: { fontSize: 12, color: COLORS.textMedium, marginTop: 2 },
  textSelectedStyle: { color: COLORS.ciruela },
  textSelectedStyleLight: { color: COLORS.ciruela, opacity: 0.8 },
  checkCircle: { width: 22, height: 22, backgroundColor: COLORS.ciruela, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  transportContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  transportOption: { width: '48%', backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 14, alignItems: 'center', elevation: 1 },
  transportOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  transportTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.textDark, marginTop: 6, textAlign: 'center' },
  transportSubtitle: { fontSize: 11, color: COLORS.textMedium, marginTop: 2, textAlign: 'center' },
  petsSelectorRow: { flexDirection: 'row', flexWrap: 'wrap' },
  petChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  petChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  petChipText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: COLORS.textDark },
  noPetsBox: { backgroundColor: '#FFF5F5', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FED7D7' },
  noPetsText: { color: '#E53E3E', fontSize: 12, textAlign: 'center' },
  dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pickerFieldButton: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 14, minHeight: 50, marginRight: 5 },
  pickerFieldText: { fontSize: 13, fontWeight: '500', color: COLORS.textDark },
  
  /* BOTÓN CORREGIDO CON MARGENES DE SEGURIDAD */
  submitBtn: { 
    backgroundColor: COLORS.ciruela, 
    borderRadius: 14, 
    paddingVertical: 15, 
    alignItems: 'center', 
    marginTop: 30, // Separación del último módulo (fecha/hora)
    marginBottom: 50, // Separa el botón del borde físico inferior de la pantalla
    elevation: 2 
  },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});