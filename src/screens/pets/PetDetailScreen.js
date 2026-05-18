import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PetDetailScreen({ navigation }) {
  // Estado para manejar la foto dinámicamente desde la cámara o el asset por defecto
  const [petPhoto, setPetPhoto] = useState(require('../../assets/otilio.jpeg'));

  // Función nativa e integrada para activar la cámara del celular
  const handleTakeDocumentPhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('El usuario canceló la toma de foto');
      } else if (response.errorCode) {
        Alert.alert('Error', 'No se pudo abrir la cámara: ' + response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setPetPhoto(source);
      }
    });
  };

  // Función interna reutilizable para renderizar cada fila con espaciados premium
  const renderDetailItem = (icon, label, value, isLast = false) => (
    <View style={[styles.infoRow, isLast && styles.lastRow]}>
      <View style={styles.labelGroup}>
        <Text style={styles.iconPlaceholder}>{icon}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={[styles.valueText, label === 'Notas' && styles.notesValue]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Un color de fondo ligeramente off-white para que la tarjeta blanca resalte en capas */}
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F6" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.ciruela} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Mascota</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={{ fontSize: 15 }}>✏️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* --- PERFIL MASCOTA --- */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={typeof petPhoto === 'number' ? petPhoto : { uri: petPhoto.uri }} 
              style={styles.avatarImage} 
            />
            {/* Botón de cámara estilizado con el color de marca */}
            <TouchableOpacity style={styles.cameraBadge} onPress={handleTakeDocumentPhoto}>
              <Ionicons name="camera" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.petName}>Luna</Text>
          <Text style={styles.petBreed}>Golden Retriever</Text>
        </View>

        {/* --- TARJETA UNIFICADA DE INFORMACIÓN (MEJORA DE DISEÑO UX/UI) --- */}
        <View style={styles.unifiedCard}>
          {renderDetailItem('📅', 'Fecha de nacimiento', '10/05/2021')}
          {renderDetailItem('  ⚧', ' Género', 'Hembra')}
          {renderDetailItem('⚖️', 'Peso', '24 kg')}
          {renderDetailItem('🩺', 'Condiciones médicas', 'Ninguna')}
          {renderDetailItem('📝', 'Notas', 'Es muy juguetona', true)}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Fondo off-white profesional para generar contraste tridimensional con la tarjeta blanca
  safeArea: { flex: 1, backgroundColor: '#F9F9F6' },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F6',
  },
  backButton: { width: 40, justifyContent: 'center', marginTop:50 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.ciruela, textAlign: 'center', flex: 1, marginTop:50 },
  editButton: { width: 40, alignItems: 'flex-end', justifyContent: 'center', marginTop:45},

  // Contenedor de Perfil
  profileContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.surface,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.primary || '#149284', 
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F9F9F6', // Unificado con el fondo exterior
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  petName: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark || '#1F2937', marginTop: 14 },
  petBreed: { fontSize: 15, color: COLORS.textLight || '#6B7280', marginTop: 2 },

  // DISEÑO DE TARJETA UNIFICADA PREMIUM (Quita el corte azul plano)
  unifiedCard: {
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    // Sombras nativas ultra suaves para dar efecto de elevación limpia
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // Separador interno sutil
  },
  lastRow: {
    borderBottomWidth: 0, // El último elemento no lleva línea divisoria
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 18,
    marginRight: 12,
  },
  labelText: {
    fontSize: 16,
    color: COLORS.textDark || '#374151',
    fontWeight: '500',
  },
  valueText: {
    fontSize: 16,
    color: COLORS.textDark || '#1F2937',
    fontWeight: '400',
  },
  notesValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
    color: COLORS.accent || '#4B5563',
    fontWeight: '500',
  }
});