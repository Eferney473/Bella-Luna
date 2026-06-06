import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions, Alert, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Usuario');
  const [appointments, setAppointments] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      setLoadingCitas(false);
      return;
    }

    const unsubscribeUser = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot((doc) => {
        if (doc.exists && doc.data().name) {
          setUserName(doc.data().name.split(' ')[0]);
        }
      }, error => console.log(error));

    const unsubscribeCitas = firestore()
      .collection('appointments')
      .where('ownerId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const appointmentsList = [];
        if (querySnapshot && !querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            appointmentsList.push({ id: doc.id, ...doc.data() });
          });
        }
        setAppointments(appointmentsList);
        setLoadingCitas(false);
      }, (error) => {
        console.log("Error consultando citas para el Home:", error);
        setLoadingCitas(false);
      });
        
    return () => {
      unsubscribeUser();
      unsubscribeCitas();
    };
  }, []);

  const handleManageAppointment = (cita) => {
    Alert.alert(
      'Gestionar Cita',
      `¿Qué deseas hacer con la cita de ${cita.petName} para ${cita.service}?`,
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: 'Eliminar Cita',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '¿Estás seguro?',
              'Esta acción cancelará la reserva por completo.',
              [
                { text: 'No, mantener' },
                {
                  text: 'Sí, eliminar',
                  onPress: async () => {
                    try {
                      await firestore().collection('appointments').doc(cita.id).delete();
                      Alert.alert('Eliminada', 'La cita ha sido cancelada con éxito.');
                    } catch (error) {
                      console.log(error);
                      Alert.alert('Error', 'No se pudo eliminar la cita.');
                    }
                  }
                }
              ]
            );
          }
        },
        {
          text: 'Editar Cita',
          onPress: () => {
            navigation.navigate('BookAppointment', { editingAppointment: cita });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sincronizamos la StatusBar con el color real de fondo de la app */}
      <StatusBar backgroundColor={COLORS.background || '#FAFAFA'} barStyle="dark-content" translucent={false} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* TOP BAR REESTRUCTURADA */}
        <View style={styles.topBar}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.greetingLabel}>Bienvenido</Text>
            <Text style={styles.welcomeText}>¡Hola, {userName}!</Text>
          </View>
          
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoHeader} 
            resizeMode="contain" 
          />
          
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell-outline" size={22} color={COLORS.ciruela || '#5A344E'} />
            <View style={styles.activeDot} />
          </TouchableOpacity>
        </View>

        {/* PROMO BANNER ESTILIZADO */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Ellos se merecen lo mejor</Text>
            <Text style={styles.promoSubtitle}>Servicios y productos pensados para su felicidad</Text>
          </View>
          <View style={styles.bannerImageWrapper}>
            <Image 
              source={require('../../assets/perroHome1.jpg')} 
              style={styles.bannerImage} 
              resizeMode="cover"
            />
          </View>
        </View>

        {/* SECCIÓN: NUESTROS SERVICIOS */}
        <Text style={styles.sectionTitle}>Nuestros servicios</Text>
        <View style={styles.gridContainer}>
          
          {/* Card: Guardería */}
          <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => navigation.navigate('BookAppointment', { initialService: 'Guardería' })}
          >
            <Image source={require('../../assets/guarderia11.jpeg')} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Guardería</Text>
              <Text style={styles.cardSubtitle}>5 planes disponibles</Text>
            </View>
          </TouchableOpacity>

          {/* Card: Spa Canino */}
          <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => navigation.navigate('BookAppointment', { initialService: 'Spa' })}
          >
            <Image source={require('../../assets/bañito.jpeg')} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Spa canino</Text>
              <Text style={styles.cardSubtitle}>Baño · Peluquería</Text>
            </View>
          </TouchableOpacity>

          {/* Card: Ofertas del Mes */}
          <TouchableOpacity 
            style={[styles.serviceCard, styles.ofertasCardSpecial]}
            onPress={() => navigation.navigate('Tienda')}
          >
            <Image source={require('../../assets/petshopin.jpeg')} style={styles.cardImage} />
            <View style={styles.promoBadgeFloating}>
              <MaterialCommunityIcons name="tag" size={10} color={COLORS.white || '#FFFFFF'} />
              <Text style={styles.promoBadgeFloatingText}>% PROMO</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: COLORS.ciruela || '#5A344E' }]}>Ofertas del mes</Text>
              <Text style={styles.cardSubtitle}>Descuentos exclusivos</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* SECCIÓN DINÁMICA: PRÓXIMAS CITAS */}
        <Text style={styles.sectionTitle}>Próximas citas de tus peluditos</Text>
        
        {loadingCitas ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary || '#5A344E'} />
          </View>
        ) : appointments.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.citasScrollContainer}
            snapToInterval={width * 0.78 + 12}
            decelerationRate="fast"
          >
            {appointments.map((cita) => (
              <TouchableOpacity
                key={cita.id}
                activeOpacity={0.9}
                onPress={() => handleManageAppointment(cita)}
              >
                <View style={styles.appointmentCardFull}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.tagCitaContainer}>
                      <MaterialCommunityIcons name="star-four-points" size={12} color={COLORS.white || '#FFFFFF'} />
                      <Text style={styles.tagCitaText}>Próxima cita</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{cita.status || 'Confirmada'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentBody}>
                    <View style={styles.petIconNameRow}>
                      <MaterialCommunityIcons name="dog" size={20} color={COLORS.ciruela || '#5A344E'} />
                      <Text style={styles.appointmentPetName}>{cita.petName}</Text>
                    </View>
                    <Text style={styles.appointmentService}>
                      {cita.service} • <Text style={styles.subPlanText}>{cita.subPlan}</Text>
                    </Text>
                  </View>

                  <View style={styles.appointmentFooter}>
                    <View style={{ flexDirection: 'column', gap: 4 }}>
                      <View style={styles.metaRow}>
                        <MaterialCommunityIcons name="calendar-month" size={14} color={COLORS.primaryDark || '#5A344E'} />
                        <Text style={styles.appointmentDate}>{cita.date}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textLight || '#94A3B8'} />
                        <Text style={styles.appointmentTime}>{cita.time}</Text>
                      </View>
                    </View>

                    <View style={[
                      styles.transportBadge, 
                      { backgroundColor: cita.transport?.includes('tienda') ? '#EBF8FF' : '#E6FFFA' }
                    ]}>
                      <MaterialCommunityIcons 
                        name={cita.transport?.includes('tienda') ? 'storefront' : 'truck-delivery'} 
                        size={12} 
                        color={cita.transport?.includes('tienda') ? '#2B6CB0' : '#319795'} 
                      />
                      <Text style={[
                        styles.transportBadgeText, 
                        { color: cita.transport?.includes('tienda') ? '#2B6CB0' : '#319795' }
                      ]}>
                        {cita.transport?.includes('tienda') ? 'En Tienda' : 'A Casa'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity 
            style={styles.emptyAppointmentsCard}
            onPress={() => navigation.navigate('BookAppointment', { initialService: 'Guardería' })}
          >
            <MaterialCommunityIcons name="calendar-plus" size={26} color={COLORS.textLight || '#94A3B8'} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.emptyTitle}>No tienes citas programadas</Text>
              <Text style={styles.emptySubtitle}>Toca aquí para agendar un servicio 🐾</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* SECCIÓN: MÁS SOLICITADO */}
        <Text style={styles.sectionTitle}>Más solicitado</Text>
        <View style={styles.masSolicitadoCard}>
          <View style={styles.masSolicitadoRow}>
            <Image source={require('../../assets/paseo2.jpeg')} style={styles.miniPetImage} />
            <View style={styles.masSolicitadoInfo}>
              <Text style={styles.masSolicitadoTitle}>Baño completo</Text>
              <Text style={styles.masSolicitadoSubtitle}>Spa canino · desde $45.000</Text>
            </View>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#FAFAFA' },
  scrollContainer: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 30 : 55 },
  
  /* TOP BAR REFORMADA */
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, height: 50 },
  welcomeContainer: { flex: 1, justifyContent: 'center',  },
  greetingLabel: { fontSize: 11, color: '#A0AEC0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark || '#2D3748', marginTop: 1 },
  logoHeader: { width: 110, height: '100%', position: 'absolute', left: '60%', transform: [{ translateX: -55 }] },
  notificationButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EDF2F7', position: 'relative' },
  activeDot: { position: 'absolute', top: 10, right: 11, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#E53E3E' },
  
  /* PROMO BANNER */
  promoBanner: { backgroundColor: COLORS.primary || '#70C1B3', borderRadius: 22, flexDirection: 'row', padding: 18, alignItems: 'center', overflow: 'hidden', marginBottom: 24, minHeight: 115 },
  promoTextContainer: { flex: 1.3, paddingRight: 8 },
  promoTitle: { color: COLORS.white || '#FFFFFF', fontSize: 17, fontWeight: 'bold', lineHeight: 22 },
  promoSubtitle: { color: COLORS.white || '#FFFFFF', fontSize: 11, marginTop: 4, opacity: 0.9 },
  bannerImageWrapper: { flex: 0.7, alignItems: 'flex-end' },
  bannerImage: { width: 85, height: 85, borderRadius: 42.5 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela || '#5A344E', marginTop: 4, marginBottom: 14 },
  
  /* REJILLA DE SERVICIOS */
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  serviceCard: { 
    width: '48.5%', 
    backgroundColor: COLORS.white || '#FFFFFF', 
    borderRadius: 18, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#EDF2F7', 
    overflow: 'hidden',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 4
  },
  ofertasCardSpecial: { borderColor: '#E9D8FD', backgroundColor: '#FAF5FF' },
  cardImage: { width: '100%', height: 105, resizeMode: 'cover' },
  cardInfo: { paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center' },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.textDark || '#2D3748', textAlign: 'center' },
  cardSubtitle: { fontSize: 11, color: COLORS.textLight || '#94A3B8', marginTop: 3, textAlign: 'center' },
  
  promoBadgeFloating: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.ciruela || '#5A344E', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 2 },
  promoBadgeFloatingText: { color: COLORS.white || '#FFFFFF', fontSize: 9, fontWeight: 'bold' },
  
  loadingContainer: { padding: 20, alignItems: 'center' },
  citasScrollContainer: { paddingLeft: 2, paddingRight: 16, paddingBottom: 15, marginBottom: 10 },
  
  /* TARJETA DE CITA MEJORADA */
  appointmentCardFull: { 
    width: width * 0.78, 
    backgroundColor: '#FDF8F5', 
    borderRadius: 20, 
    padding: 16, 
    marginRight: 14, 
    borderWidth: 1, 
    borderColor: '#FAEBE1', 
    elevation: 3, 
    shadowColor: '#9C4221', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 5 
  },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagCitaContainer: { flexDirection: 'row', backgroundColor: COLORS.ciruela || '#5A344E', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignItems: 'center' },
  tagCitaText: { color: COLORS.white || '#FFFFFF', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  statusBadge: { backgroundColor: '#FFF5F5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: COLORS.ciruela || '#5A344E', fontSize: 10, fontWeight: '700' },
  appointmentBody: { marginVertical: 12 },
  petIconNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  appointmentPetName: { fontSize: 17, fontWeight: 'bold', color: COLORS.textDark || '#2D3748', marginLeft: 6 },
  appointmentService: { fontSize: 13, color: '#4A5568', marginTop: 2 },
  subPlanText: { color: COLORS.ciruela || '#5A344E', fontWeight: '600' },
  appointmentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, borderTopWidth: 1, borderTopColor: '#F7E6DC', paddingTop: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  appointmentDate: { fontSize: 12, fontWeight: 'bold', color: COLORS.primaryDark || '#2B6CB0', marginLeft: 4 },
  appointmentTime: { fontSize: 12, color: '#4A5568', marginLeft: 4, fontWeight: '500' },
  transportBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  transportBadgeText: { fontSize: 11, fontWeight: '600', marginLeft: 4 },
  
  emptyAppointmentsCard: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 18, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', marginBottom: 12 },
  emptyTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.textDark || '#2D3748' },
  emptySubtitle: { fontSize: 11, color: COLORS.textLight || '#94A3B8', marginTop: 2 },
  
  /* RECOMENDADO CARD */
  masSolicitadoCard: { 
    backgroundColor: COLORS.white || '#FFFFFF', 
    borderRadius: 18, 
    padding: 14, 
    borderWidth: 1, 
    borderColor: '#EDF2F7',
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.02, 
    shadowRadius: 2 
  },
  masSolicitadoRow: { flexDirection: 'row', alignItems: 'center' },
  miniPetImage: { width: 48, height: 48, borderRadius: 12 },
  masSolicitadoInfo: { flex: 1, marginLeft: 12 },
  masSolicitadoTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark || '#2D3748' },
  masSolicitadoSubtitle: { fontSize: 12, color: COLORS.textLight || '#94A3B8', marginTop: 1 },
  popularBadge: { backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  popularText: { color: '#9333EA', fontSize: 11, fontWeight: 'bold' }
});