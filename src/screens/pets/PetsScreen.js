import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function PetsScreen({ navigation }) {
  
  const misMascotas = [
    {
      id: '1',
      nombre: 'Max',
      raza: 'Golden Retriever',
      edad: '3 años',
      genero: 'Macho',
      peso: '28 kg',
      bgColor: '#54D1A3', // Color del fondo del ícono izquierdo
    },
    {
      id: '2',
      nombre: 'Luna',
      raza: 'Gato persa',
      edad: '2 años',
      genero: 'Hembra',
      peso: '4 kg',
      bgColor: '#FFC816', // Color del fondo del ícono izquierdo
    },
  ];

  const renderPetCard = ({ item }) => (
    <View style={styles.petCard}>
      {/* Icono izquierdo con fondo de color */}
      <View style={[styles.petIconContainer, { backgroundColor: item.bgColor }]}>
        <Ionicons name="paw" size={32} color={COLORS.white} />
      </View>

      {/* Información Central */}
      <View style={styles.infoContainer}>
        <Text style={styles.petName}>{item.nombre}</Text>
        <Text style={styles.petDetails}>{item.raza} · {item.edad}</Text>
        
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: '#FAF5FF' }]}>
            <Text style={[styles.badgeText, { color: COLORS.ciruela }]}>{item.genero}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#E6F4EA' }]}>
            <Text style={[styles.badgeText, { color: '#137333' }]}>{item.peso}</Text>
          </View>
        </View>
      </View>

      {/* Botones de Acción Derecho */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary || '#149284'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor='#70C1B3' />
      
      {/* --- HEADER CON FONDO VERDE MENTA (SOLO TÍTULO, SUBTÍTULO Y BOTÓN CIRCULAR) --- */}
      <View style={styles.greenHeader}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Mis mascotas</Text>
          <Text style={styles.headerSubtitle}>Bella Luna · Como en casa</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerAddButton}
          onPress={() => alert('Agregar mascota')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={COLORS.oro} />
        </TouchableOpacity>
      </View>

      {/* --- CONTENEDOR BLANCO GENERAL PARA LAS TARJETAS --- */}
      <View style={styles.whiteBodyContainer}>
        <FlatList
          data={misMascotas}
          keyExtractor={(item) => item.id}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity style={styles.addCardDashed} activeOpacity={0.7}>
              <View style={styles.addIconCircle}>
                <Ionicons name="add" size={26} color={COLORS.primary || '#149284'} />
              </View>
              <Text style={styles.addCardText}>Agregar mascota</Text>
            </TouchableOpacity>
          }
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#70C1B3' // Mantiene la parte superior del notch del mismo color
  },
  
  // Header Verde Menta Aislado
  greenHeader: {
    backgroundColor: '#70C1B3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    marginTop:50
  },
  headerTextGroup: {
    flexDirection: 'column',
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.white 
  },
  headerSubtitle: { 
    fontSize: 13, 
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2
  },
  headerAddButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.ciruela, // Botón circular morado
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  // Contenedor Blanco Inferior (Panel)
  whiteBodyContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  
  },
  listContainer: { 
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30
  },

  // Tarjetas de Mascota
  petCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECECE7',
    flexDirection: 'row',
    padding: 14,
    marginTop: 20,

    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  petIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.ciruela,
    marginBottom: 2,
  },
  petDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    paddingLeft: 4,
  },
  actionButton: {
    padding: 4,
  },

  // Botón de agregar mascota punteado (Dashed)
  addCardDashed: {
    backgroundColor: '#E8F6F4',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  addIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  addCardText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 14,
  },
});