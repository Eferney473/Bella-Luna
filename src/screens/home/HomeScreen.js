import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { COLORS } from '../../theme/colors';
import HeartIcon from '../../assets/heart-icon';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  
  // --- SIMULACIÓN DE ESTADO DE PRÓXIMA CITA ---
  // Cambia este objeto a 'null' para probar cómo regresa a tu diseño clásico de "Agenda aquí"
  const [proximaCita, setProximaCita] = useState({
    id: 'c123',
    servicio: 'Spa (Baño completo)',
    mascota: 'Max',
    fecha: 'Sáb 17 de Mayo',
    hora: '10:00 AM',
  });

  const servicios = [
    { id: '1', nombre: 'Guardería', sublabel: '5 planes', img: require('../../assets/guarderia11.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Guardería' } },
    { id: '2', nombre: 'Spa canino', sublabel: 'Baño · Peluquería', img: require('../../assets/bañito.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Spa' } },
    { id: '3', nombre: 'Tienda', sublabel: 'Ver ofertas del mes', img: require('../../assets/petshopin.jpeg'), destino: 'Tienda', params: { filter: 'destacados' } }, // Atajo promocional
    { id: '4', nombre: 'Citas', sublabel: 'Ver ofertas del', img: require('../../assets/pase.jpeg'), destino: 'Citas', params: null },
  ];

  const masSolicitados = [
    { id: '1', nombre: 'Baño completo', detalle: 'Spa canino · desde $45.000', tag: 'Popular', colorTag: '#FAF5FF', textTag: '#7C3AED', img: require('../../assets/baños.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Spa' } },
    { id: '2', nombre: 'Mañanas de parque', detalle: 'Guardería · 9am–1pm', tag: 'Nuevo', colorTag: '#E6F4EA', textTag: '#137333', img: require('../../assets/guarde.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Guardería' } },
  ];

  const handleNavigation = (item) => {
    if (item.params) {
      navigation.navigate(item.destino, item.params);
    } else {
      navigation.navigate(item.destino);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.ciruela} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>¡Hola, Ana!</Text>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color={COLORS.ciruela} />
          </TouchableOpacity>
        </View>

        {/* --- BANNER PRINCIPAL --- */}
        <View style={styles.banner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>
              Ellos se merecen lo mejor {"  "}      
              <View style={styles.heartInlineContainer}>
                <HeartIcon 
                  color={COLORS.oro || '#D4AF37'} 
                  size={24} 
                  value={null}
                />
              </View>
            </Text>
            <Text style={styles.bannerSubTitle}>Servicios y productos pensados para su felicidad</Text>
          </View>
          <Image 
            source={require('../../assets/perroHome1.jpg')} 
            style={styles.bannerImage} 
            resizeMode="contain"
          />
        </View>

        {/* --- SECCIÓN NUESTROS SERVICIOS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nuestros servicios</Text>
        </View>
        
        <View style={styles.servicesGrid}>
          {servicios.map((item) => {
            // INTERCEPCIÓN CON SUPERPODER: Si la tarjeta es Citas y hay una reserva activa
            if (item.nombre === 'Citas' && proximaCita) {
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.gridCard, styles.gridCardActiveAppointment]}
                  onPress={() => navigation.navigate('Citas', { citaId: proximaCita.id })}
                  activeOpacity={0.8}
                >
                  {/* Badge superior indicando el estado */}
                  <View style={styles.appointmentBadge}>
                    <Ionicons name="sparkles" size={12} color={COLORS.white} />
                    <Text style={styles.appointmentBadgeText}>Próxima cita</Text>
                  </View>
                  
                  {/* Contenido personalizado inteligente */}
                  <View style={styles.cardActiveTextContent}>
                    <Text style={styles.activePetName} numberOfLines={1}>{proximaCita.mascota}</Text>
                    <Text style={styles.activeServiceLabel} numberOfLines={1}>{proximaCita.servicio}</Text>
                    <Text style={styles.activeDateLabel} numberOfLines={1}>{proximaCita.fecha}</Text>
                    <Text style={styles.activeTimeLabel} numberOfLines={1}>{proximaCita.hora}</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            // RENDERIZADO ESTÁNDAR (Para Guardería, Spa, Tienda y Citas sin agendar)
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.gridCard}
                onPress={() => handleNavigation(item)}
                activeOpacity={0.8}
              >
                <View style={styles.gridImageContainer}>
                  <Image source={item.img} style={styles.cardImage} />
                </View>
                
                <View style={styles.cardTextContent}>
                  <Text style={styles.gridCardLabel} numberOfLines={1}>{item.nombre}</Text>
                  <Text style={styles.gridCardSubLabel} numberOfLines={1}>{item.sublabel}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* --- SECCIÓN MÁS SOLICITADO --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Más solicitado</Text>
        </View>

        <View style={styles.verticalContainer}>
          {masSolicitados.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.verticalRowCard}
              onPress={() => handleNavigation(item)}
              activeOpacity={0.8}
            >
              <View style={styles.verticalImageContainer}>
                <Image source={item.img} style={styles.cardImage} />
              </View>
              
              <View style={styles.verticalTextContent}>
                <Text style={styles.verticalCardTitle}>{item.nombre}</Text>
                <Text style={styles.verticalCardSubTitle}>{item.detalle}</Text>
              </View>

              <View style={[styles.tagBadge, { backgroundColor: item.colorTag }]}>
                <Text style={[styles.tagBadgeText, { color: item.textTag }]}>{item.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white},
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    marginTop: 45,
    marginBottom: 16,
  },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: COLORS.ciruela, flex: 1 },
  headerLogo: { width: 120, height: 60, flex: 1, marginTop: 20, color: COLORS.ciruela, },
  notificationButton: { width: 40, alignItems: 'flex-end', flex: 0.5,  },

  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 120,
    marginBottom: 30,
    overflow: 'hidden'
  },
  bannerTextContainer: { width: '60%' },
  bannerTitle: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', lineHeight: 22},
  
  heartInlineContainer: {
    width: 18,
    height: 16,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:2 
  },
  
  bannerSubTitle: { color: COLORS.white, fontSize: 12, lineHeight: 20, marginTop: 4 },
  bannerImage: { width: '50%', height: 130, position: 'absolute', right: 0, bottom: -1 },

  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela },

  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: (width - 32 - 12) / 2, 
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E1B01E',
    borderRadius: 16,
    overflow: 'hidden', 
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1.5,
    minHeight: 148, // Mantiene la simetría perfecta de las tarjetas
  },
  
  // --- ESTILOS ADICIONALES PARA LA TARJETA CON CITA ACTIVA ---
  gridCardActiveAppointment: {
    borderColor: COLORS.ciruela,
    borderWidth: 1.5,
    backgroundColor: '#FAF5FF',
    justifyContent: 'flex-start',
  },
  appointmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ciruela,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomRightRadius: 12,
    alignSelf: 'flex-start',
  },
  appointmentBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold', marginLeft: 3 },
  cardActiveTextContent: {
    padding: 10,
    width: '100%',
  },
  activePetName: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 2 },
  activeServiceLabel: { fontSize: 12, color: '#4B5563', fontWeight: '500', marginBottom: 6 },
  activeDateLabel: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold' },
  activeTimeLabel: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 1 },
  // -----------------------------------------------------------

  gridImageContainer: {
    width: '100%', 
    height: 100, 
    backgroundColor: '#F3F4F6',
  },
  cardTextContent: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center', 
  },
  gridCardLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark || '#1F2937', textAlign: 'center', marginBottom: 2 },
  gridCardSubLabel: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },

  verticalContainer: {
    marginBottom: 20,
  },
  verticalRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#59374F',
    borderRadius: 18,
    padding: 10, 
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1.5,
  },
  verticalImageContainer: {
    width: 50, 
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  verticalTextContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  verticalCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  verticalCardSubTitle: { fontSize: 11, color: '#6B7280' },
  
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagBadgeText: { fontSize: 10, fontWeight: 'bold' },

  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' }
});