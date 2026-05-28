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
  Dimensions,
  Modal
} from 'react-native';
import { COLORS } from '../../theme/colors';
import HeartIcon from '../../assets/heart-icon';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  
  // --- SIMULACIÓN DE ESTADO DE PRÓXIMA CITA ---
  const [proximaCita, setProximaCita] = useState({
    id: 'c123',
    servicio: 'Spa (Baño completo)',
    mascota: 'Max',
    fecha: 'Sáb 17 de Mayo',
    hora: '10:00 AM',
  });

  // --- ESTADOS PARA CONTROLAR EL MODAL DEL COLLAGE ---
  const [modalVisible, setModalVisible] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // --- BANCO DE IMÁGENES PARA LOS COLLAGES ---
  // Nota: Reemplaza estos placeholders o require por tus imágenes reales en assets
  const galerias = {
    'Baño completo': {
      titulo: 'Spa & Baño Completo',
      descripcion: 'Higiene profunda, hidratación de pelaje y mimos garantizados.',
      imagenes: [
        require('../../assets/baño1.jpeg'), // Imagen principal
        require('../../assets/baño2.jpeg'), 
        require('../../assets/baño3.jpeg'), 
      ]
    },
    'Mañanas de parque': {
      titulo: 'Mañanas de Parque',
      descripcion: 'Socialización, juegos al aire libre y monitoreo profesional de energía.',
      imagenes: [
        require('../../assets//paseo1.jpeg'), // Imagen principal
        require('../../assets/paseo2.jpeg'),
        require('../../assets/paseo3.jpeg'),
      ]
    }
  };

  const servicios = [
    { id: '1', nombre: 'Guardería', sublabel: '5 planes', img: require('../../assets/guarderia11.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Guardería' } },
    { id: '2', nombre: 'Spa canino', sublabel: 'Baño · Peluquería', img: require('../../assets/bañito.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Spa' } },
    { id: '3', nombre: 'Ofertas del mes', sublabel: 'Descuentos exclusivos', img: require('../../assets/petshopin.jpeg'), destino: 'Ofertas', params: { filter: 'destacados' } },
    { id: '4', nombre: 'Citas', sublabel: 'Ver ofertas del', img: require('../../assets/pase.jpeg'), destino: 'Citas', params: null },
  ];

  const masSolicitados = [
    { id: '1', nombre: 'Baño completo', detalle: 'Spa canino · desde $45.000', tag: 'Popular', colorTag: '#FAF5FF', textTag: '#7C3AED', img: require('../../assets/baños.jpeg'), esCollage: true },
    { id: '2', nombre: 'Mañanas de parque', detalle: 'Guardería · 9am–1pm', tag: 'Nuevo', colorTag: '#E6F4EA', textTag: '#137333', img: require('../../assets/guarde.jpeg'), esCollage: true },
  ];

  // Manejador inteligente de clicks
  const handleItemPress = (item) => {
    if (item.esCollage) {
      // Si la tarjeta está configurada para mostrar collage, abrimos el modal dinámico
      setServicioSeleccionado(galerias[item.nombre]);
      setModalVisible(true);
    } else if (item.params) {
      navigation.navigate(item.destino, item.params);
    } else {
      navigation.navigate(item.destino);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
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
            if (item.nombre === 'Citas' && proximaCita) {
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.gridCard, styles.gridCardActiveAppointment]}
                  onPress={() => navigation.navigate('Citas', { citaId: proximaCita.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.appointmentBadge}>
                    <Ionicons name="sparkles" size={12} color={COLORS.white} />
                    <Text style={styles.appointmentBadgeText}>Próxima cita</Text>
                  </View>
                  
                  <View style={styles.cardActiveTextContent}>
                    <Text style={styles.activePetName} numberOfLines={1}>{proximaCita.mascota}</Text>
                    <Text style={styles.activeServiceLabel} numberOfLines={1}>{proximaCita.servicio}</Text>
                    <Text style={styles.activeDateLabel} numberOfLines={1}>{proximaCita.fecha}</Text>
                    <Text style={styles.activeTimeLabel} numberOfLines={1}>{proximaCita.hora}</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.gridCard}
                onPress={() => handleItemPress(item)}
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
              onPress={() => handleItemPress(item)}
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

      {/* --- MODAL DE COLLAGE INTERACTIVO (INSPIRACIONAL Y LIMPIO) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Barra de arrastre visual superior */}
            <View style={styles.dragIndicator} />
            
            {/* Botón Cerrar */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={30} color="#9CA3AF" />
            </TouchableOpacity>

            {servicioSeleccionado && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                <Text style={styles.modalTitle}>{servicioSeleccionado.titulo}</Text>
                <Text style={styles.modalDescription}>{servicioSeleccionado.descripcion}</Text>

                {/* --- MOSAICO TIPO PINTEREST / COLLAGE --- */}
                <View style={styles.collageGrid}>
                  {/* Bloque Izquierdo (Imagen Vertical Grande) */}
                  <View style={styles.collageLeftColumn}>
                    <Image source={servicioSeleccionado.imagenes[0]} style={styles.collageBigImage} />
                  </View>

                  {/* Bloque Derecho (Dos imágenes cuadradas apiladas) */}
                  <View style={styles.collageRightColumn}>
                    <Image source={servicioSeleccionado.imagenes[1]} style={styles.collageSmallImage} />
                    <Image source={servicioSeleccionado.imagenes[2]} style={styles.collageSmallImage} />
                  </View>
                </View>

                {/* Imagen Panorámica Inferior de Cierre */}
                <Image source={servicioSeleccionado.imagenes[3]} style={styles.collageWideImage} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  notificationButton: { width: 40, alignItems: 'flex-end', flex: 0.5 },

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
    minHeight: 148,
  },
  
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
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  // --- ESTILOS DEL MODAL DE COLLAGE ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo oscuro translúcido premium
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.85, // Máximo 85% de la pantalla para comodidad
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  modalScroll: {
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.ciruela,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  // Rejilla estructural estilo Mosaico
  collageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 240,
    marginBottom: 12,
  },
  collageLeftColumn: {
    width: '48%',
    height: '100%',
  },
  collageBigImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  collageRightColumn: {
    width: '48%',
    justifyContent: 'space-between',
    height: '100%',
  },
  collageSmallImage: {
    width: '100%',
    height: '114%',
    maxHeight: 114,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  collageWideImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: 25,
  },
  bookServiceButton: {
    backgroundColor: COLORS.primary || '#149284',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookServiceButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});