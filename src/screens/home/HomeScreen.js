import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Ana');
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
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* TOP BAR CON LOGO REAL */}
        <View style={styles.topBar}>
          <Text style={styles.welcomeText}>¡Hola, {userName}!</Text>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoHeader} 
            resizeMode="contain" 
          />
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell" size={26} color={COLORS.ciruela} />
          </TouchableOpacity>
        </View>

        {/* PROMO BANNER CON IMAGEN DEL PERRITO */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Ellos se merecen lo mejor</Text>
            <Text style={styles.promoSubtitle}>Servicios y productos pensados para su felicidad</Text>
          </View>
          <Image 
            source={require('../../assets/perroHome1.jpg')} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
        </View>

        {/* SECCIÓN: NUESTROS SERVICIOS */}
        <Text style={styles.sectionTitle}>Nuestros servicios</Text>
        <View style={styles.gridContainer}>
          
          {/* Card: Guardería -> Redirecciona con parámetro */}
          <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => navigation.navigate('BookAppointment', { initialService: 'Guardería' })}
          >
            <Image source={require('../../assets/guarderia11.jpeg')} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Guardería</Text>
              <Text style={styles.cardSubtitle}>5 planes</Text>
            </View>
          </TouchableOpacity>

          {/* Card: Spa Canino -> Redirecciona con parámetro */}
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

          {/* NUEVA Card: Ofertas del Mes (Integrada simétricamente en la grilla) */}
          <TouchableOpacity 
            style={[styles.serviceCard, styles.ofertasCardSpecial]}
            onPress={() => navigation.navigate('Tienda')} // O la navegación que definas para promos
          >
            <Image source={require('../../assets/petshopin.jpeg')} style={styles.cardImage} />
            {/* Pequeño badge flotante sobre la foto para denotar que es una promo */}
            <View style={styles.promoBadgeFloating}>
              <MaterialCommunityIcons name="tag" size={10} color={COLORS.white} />
              <Text style={styles.promoBadgeFloatingText}>% PROMO</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: COLORS.ciruela }]}>Ofertas del mes</Text>
              <Text style={styles.cardSubtitle}>Descuentos exclusivos</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* SECCIÓN DINÁMICA: PRÓXIMAS CITAS */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Próximas citas de tus peluditos</Text>
        
        {loadingCitas ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : appointments.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.citasScrollContainer}
            snapToInterval={width * 0.75 + 12}
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
                      <MaterialCommunityIcons name="star-four-points" size={12} color={COLORS.white} />
                      <Text style={styles.tagCitaText}>Próxima cita</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{cita.status || 'Confirmada'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentBody}>
                    <View style={styles.petIconNameRow}>
                      <MaterialCommunityIcons name="dog" size={22} color={COLORS.ciruela} />
                      <Text style={styles.appointmentPetName}>{cita.petName}</Text>
                    </View>
                    <Text style={styles.appointmentService}>
                      {cita.service} • <Text style={styles.subPlanText}>{cita.subPlan}</Text>
                    </Text>
                  </View>

                  <View style={styles.appointmentFooter}>
                    <View style={{ flexDirection: 'column', gap: 4 }}>
                      <View style={styles.metaRow}>
                        <MaterialCommunityIcons name="calendar-month" size={14} color={COLORS.primaryDark} />
                        <Text style={styles.appointmentDate}>{cita.date}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textLight} />
                        <Text style={styles.appointmentTime}>{cita.time}</Text>
                      </View>
                    </View>

                    {/* NUEVO: Badge de Logística de Transporte (Tienda o Casa) */}
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
            <MaterialCommunityIcons name="calendar-plus" size={28} color={COLORS.textLight} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.emptyTitle}>No tienes citas programadas</Text>
              <Text style={styles.emptySubtitle}>Toca aquí para agendar un servicio 🐾</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* SECCIÓN: MÁS SOLICITADO */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Más solicitado</Text>
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
  container: { flex: 1, backgroundColor: COLORS.background, marginTop: 50 },
  scrollContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  logoHeader: { width: 180, height: 60 },
  notificationButton: { padding: 4 },
  promoBanner: { backgroundColor: COLORS.primary, borderRadius: 20, flexDirection: 'row', padding: 15, alignItems: 'center', overflow: 'hidden', marginBottom: 20 },
  promoTextContainer: { flex: 1.2, paddingRight: 5 },
  promoTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  promoSubtitle: { color: COLORS.white, fontSize: 12, marginTop: 4 },
  bannerImage: { width: 100, height: 100, borderRadius: 50, flex: 0.6 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 12 },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 10 
  },
  serviceCard: { 
    width: '48.5%', // Ajustado para un espaciado perfecto de dos columnas
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#EDF2F7', 
    overflow: 'hidden',
    position: 'relative'
  },
  ofertasCardSpecial: {
    borderColor: '#E9D8FD', // Sutil borde lila para diferenciarlo sin romper el ecosistema visual
    backgroundColor: '#FAF5FF', 
  },
  cardImage: { width: '100%', height: 110, resizeMode: 'cover' },
  cardInfo: { 
    paddingVertical: 12, 
    paddingHorizontal: 8,
    alignItems: 'center' 
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: COLORS.textDark,
    textAlign: 'center'
  },
  cardSubtitle: { 
    fontSize: 11, 
    color: COLORS.textLight, 
    marginTop: 2,
    textAlign: 'center'
  },
  promoBadgeFloating: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.ciruela,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 2
  },
  promoBadgeFloatingText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold'
  },
  loadingContainer: { padding: 20, alignItems: 'center' },
  citasScrollContainer: { paddingLeft: 2, paddingRight: 16, paddingBottom: 5 },
  appointmentCardFull: { width: width * 0.75, backgroundColor: '#FDF8F5', borderRadius: 18, padding: 14, marginRight: 12, borderWidth: 1, borderColor: '#FAEBE1', elevation: 1, shadowColor: '#9C4221', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2 },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagCitaContainer: { flexDirection: 'row', backgroundColor: COLORS.ciruela, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignItems: 'center' },
  tagCitaText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold', marginLeft: 3 },
  statusBadge: { backgroundColor: '#FFF5F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { color: COLORS.ciruela, fontSize: 10, fontWeight: '700' },
  appointmentBody: { marginVertical: 10 },
  petIconNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  appointmentPetName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginLeft: 6 },
  appointmentService: { fontSize: 13, color: COLORS.textMedium, marginTop: 2 },
  subPlanText: { color: COLORS.ciruela, fontWeight: '600' },
  appointmentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, borderTopWidth: 1, borderTopColor: '#F7E6DC', paddingTop: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  appointmentDate: { fontSize: 12, fontWeight: 'bold', color: COLORS.primaryDark, marginLeft: 4 },
  appointmentTime: { fontSize: 12, color: COLORS.textDark, marginLeft: 4, fontWeight: '500' },
  transportBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-end' },
  transportBadgeText: { fontSize: 11, fontWeight: '600', marginLeft: 4 },
  emptyAppointmentsCard: { flexDirection: 'row', backgroundColor: '#F7FAFC', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark },
  emptySubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  masSolicitadoCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#EDF2F7', marginTop: 5 },
  masSolicitadoRow: { flexDirection: 'row', alignItems: 'center' },
  miniPetImage: { width: 50, height: 50, borderRadius: 12 },
  masSolicitadoInfo: { flex: 1, marginLeft: 12 },
  masSolicitadoTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark },
  masSolicitadoSubtitle: { fontSize: 12, color: COLORS.textLight },
  popularBadge: { backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  popularText: { color: '#9333EA', fontSize: 11, fontWeight: 'bold' }
});