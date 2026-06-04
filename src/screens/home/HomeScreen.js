import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

export default function HomeScreen() {
  const [userName, setUserName] = useState('Ana'); // 'Ana' por defecto como en tu maqueta

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(currentUser.uid)
        .onSnapshot((doc) => {
          if (doc.exists && doc.data().name) {
            setUserName(doc.data().name.split(' ')[0]);
          }
        }, error => console.log(error));
        
      return () => unsubscribe();
    }
  }, []);

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
          
          {/* Card: Guardería */}
          <TouchableOpacity style={styles.serviceCard}>
            <Image source={require('../../assets/guarderia11.jpeg')} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Guardería</Text>
              <Text style={styles.cardSubtitle}>5 planes</Text>
            </View>
          </TouchableOpacity>

          {/* Card: Spa Canino */}
          <TouchableOpacity style={styles.serviceCard}>
            <Image source={require('../../assets/bañito.jpeg')} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Spa canino</Text>
              <Text style={styles.cardSubtitle}>Baño · Peluquería</Text>
            </View>
          </TouchableOpacity>

          {/* Card: Ofertas del Mes */}
          <TouchableOpacity style={styles.serviceCard}>
            <Image source={require('../../assets/petshopin.jpeg')} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Ofertas del mes</Text>
              <Text style={styles.cardSubtitle}>Descuentos exclusivos</Text>
            </View>
          </TouchableOpacity>

          {/* Card: Próxima Cita Estática */}
          <View style={styles.appointmentCard}>
            <View style={styles.tagCitaContainer}>
              <MaterialCommunityIcons name="star-four-points" size={12} color={COLORS.white} />
              <Text style={styles.tagCitaText}>Próxima cita</Text>
            </View>
            <Text style={styles.appointmentPetName}>Max</Text>
            <Text style={styles.appointmentService}>Spa (Baño completo)</Text>
            <Text style={styles.appointmentDate}>Sáb 17 de Mayo</Text>
            <Text style={styles.appointmentTime}>10:00 AM</Text>
          </View>

        </View>

        {/* SECCIÓN: MÁS SOLICITADO */}
        <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Más solicitado</Text>
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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: { width: '45%', backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#EDF2F7', overflow: 'hidden' },
  cardImage: { width: '100%', height: 120, resizeMode: 'cover' },
  cardInfo: { padding: 10, alignItems: 'center' },
  
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark },
  cardSubtitle: { fontSize: 11, color: COLORS.textLight, marginTop: 1 },
  appointmentCard: { width: '48%', backgroundColor: '#FDF8F5', borderRadius: 16, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#FAEBE1' },
  tagCitaContainer: { flexDirection: 'row', backgroundColor: COLORS.ciruela, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignItems: 'center' },
  tagCitaText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold', marginLeft: 3 },
  appointmentPetName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginTop: 8 },
  appointmentService: { fontSize: 12, color: COLORS.textMedium },
  appointmentDate: { fontSize: 12, fontWeight: 'bold', color: COLORS.primaryDark, marginTop: 10 },
  appointmentTime: { fontSize: 11, color: COLORS.textLight },
  masSolicitadoCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#EDF2F7', marginTop: 5 },
  masSolicitadoRow: { flexDirection: 'row', alignItems: 'center' },
  miniPetImage: { width: 50, height: 50, borderRadius: 12 },
  masSolicitadoInfo: { flex: 1, marginLeft: 12 },
  masSolicitadoTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark },
  masSolicitadoSubtitle: { fontSize: 12, color: COLORS.textLight },
  popularBadge: { backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  popularText: { color: '#9333EA', fontSize: 11, fontWeight: 'bold' }
});