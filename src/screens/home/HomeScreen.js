import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../config/colors';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Text style={styles.welcomeText}>¡Hola, Ana!</Text>
          <Text style={styles.brandText}>Bella Luna</Text>
          <TouchableOpacity>
            <Feather name="bell" size={24} color={COLORS.ciruela} />
          </TouchableOpacity>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Ellos se merecen lo mejor 💛</Text>
            <Text style={styles.promoSubtitle}>Servicios y productos pensados para su felicidad</Text>
          </View>
          {/* Aquí puedes mapear un Image local para el perrito */}
          <View style={styles.placeholderDogImage} />
        </View>

        {/* Sección de Servicios */}
        <Text style={styles.sectionTitle}>Nuestros servicios</Text>
        
        <View style={styles.gridContainer}>
          {/* Servicio 1: Guardería */}
          <TouchableOpacity style={styles.serviceCard}>
            <View style={[styles.cardImagePlaceholder, { backgroundColor: '#FEEBC8' }]} />
            <Text style={styles.cardTitle}>Guardería</Text>
            <Text style={styles.cardSubtitle}>5 planes</Text>
          </TouchableOpacity>

          {/* Servicio 2: Spa Canino */}
          <TouchableOpacity style={styles.serviceCard}>
            <View style={[styles.cardImagePlaceholder, { backgroundColor: '#EBF8FF' }]} />
            <Text style={styles.cardTitle}>Spa canino</Text>
            <Text style={styles.cardSubtitle}>Baño · Peluquería</Text>
          </TouchableOpacity>

          {/* Servicio 3: Ofertas del Mes */}
          <TouchableOpacity style={styles.serviceCard}>
            <View style={[styles.cardImagePlaceholder, { backgroundColor: '#E2E8F0' }]} />
            <Text style={styles.cardTitle}>Ofertas del mes</Text>
            <Text style={styles.cardSubtitle}>Descuentos exclusivos</Text>
          </TouchableOpacity>

          {/* Servicio 4: Próxima Cita Card */}
          <View style={[styles.serviceCard, { backgroundColor: '#F7FAFC', borderLeftWidth: 4, borderLeftColor: COLORS.ciruela }]}>
            <Text style={styles.appointmentTag}>📌 Próxima cita</Text>
            <Text style={styles.petName}>Max</Text>
            <Text style={styles.appointmentDetail}>Spa (Baño completo)</Text>
            <Text style={styles.appointmentDate}>Sáb 17 de Mayo</Text>
            <Text style={styles.appointmentTime}>10:00 AM</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.ciruela,
  },
  brandText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.ciruela,
  },
  promoBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  promoTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  promoTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  promoSubtitle: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 5,
    opacity: 0.9,
  },
  placeholderDogImage: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.white,
    borderRadius: 35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.ciruela,
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  appointmentTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.ciruela,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 4,
  },
  appointmentDetail: {
    fontSize: 12,
    color: COLORS.textMedium,
  },
  appointmentDate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 5,
  },
  appointmentTime: {
    fontSize: 12,
    color: COLORS.textMedium,
  },
});