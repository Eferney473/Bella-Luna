import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Platform
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function PetsScreen({ navigation }) {
  
  // Lista local de mascotas (por ahora solo Luna, con los datos de tu maqueta)
  const misMascotas = [
    {
      id: '1',
      nombre: 'Luna',
      raza: 'Golden Retriever',
      genero: 'Hembra',
      peso: '24 kg',
      fechaNacimiento: '10/05/2021',
      condiciones: 'Ninguna',
      notas: 'Es muy juguetona',
      img: require('../../assets/perroHome.jpg'), // Usando el asset de portada para la lista
    },
  ];

  // Manejador del click hacia el detalle
  const handlePetPress = (mascota) => {
    navigation.navigate('DetalleMascota', { mascota: mascota });
  };

  const renderPetCard = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.petCard}
        onPress={() => handlePetPress(item)}
        activeOpacity={0.9}
      >
        <Image source={item.img} style={styles.petImage} resizeMode="cover" />
        
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.petName}>{item.nombre}</Text>
            <Ionicons 
              name={item.genero === 'Hembra' ? 'female' : 'male'} 
              size={18} 
              color={item.genero === 'Hembra' ? '#EC4899' : '#3B82F6'} 
            />
          </View>
          
          <Text style={styles.petBreed}>{item.raza}</Text>
          
          <View style={styles.tagRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.peso}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.badgeText, { color: '#1E40AF' }]}>3 Años</Text>
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Mascotas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => alert('Formulario para agregar mascota en desarrollo')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color={COLORS.white} style={{ marginRight: 4 }} />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* --- LISTADO DE MASCOTAS --- */}
      <FlatList
        data={misMascotas}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="paw-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>Aún no registras ninguna mascota</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 16,
    margin: 50,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary || '#149284',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  addButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },

  listContainer: { padding: 16 },

  // Tarjeta de Mascota Premium
  petCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark || '#1F2937',
    marginRight: 8,
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  arrowContainer: {
    paddingHorizontal: 4,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});