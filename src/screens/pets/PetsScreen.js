// src/screens/pets/PetsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar, 
  FlatList, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { subscribeToUserPets, addMockPet } from '../../database/petService';

const USER_ID_TEST = "user_ana_123"; // ID simulado hasta conectar Auth global

export default function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // Escucha los cambios de la base de datos en tiempo real
    const unsubscribe = subscribeToUserPets(USER_ID_TEST, (petsList) => {
      setPets(petsList);
    });
    return () => unsubscribe(); // Limpia la conexión al salir de la pantalla
  }, []);

  const handleAddPet = () => {
    // Inserta una mascota de prueba rápido en Firebase para verificar que funciona
    addMockPet(USER_ID_TEST, "Luna", "Perro", "Golden Retriever", "3 años");
  };

  const renderPetItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.petCard}
      onPress={() => navigation.navigate('DetalleMascota', { pet: item })}
    >
      <Image 
        source={item.especie === 'Gato' ? require('../../assets/perroHome.jpg') : require('../../assets/logo_perros.jpeg')} 
        style={styles.petAvatar} 
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.nombre}</Text>
        <Text style={styles.petBreed}>{item.raza}</Text>
        <Text style={styles.petAge}>{item.edad || '2 años'}</Text>
      </View>
      <Text style={styles.arrowIcon}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* --- HEADER SUPERIOR --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Mascotas</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* --- LISTADO DESDE FIREBASE --- */}
      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        renderItem={renderPetItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes mascotas registradas. Presiona "+ Agregar"</Text>
        }
      />

      {/* --- TARJETA REQUISITO INFERIOR --- */}
      <View style={styles.infoBanner}>
        <Text style={styles.heartIcon}>🩵</Text>
        <Text style={styles.infoBannerText}>
          Mantén la información de tus mascotas actualizada para brindarles el mejor servicio.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.ciruela, marginTop: 50 },
  addButton: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginTop: 50 },
  addButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 16 },
  
  // Cards de mascotas
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  petAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.surface },
  petInfo: { flex: 1, marginLeft: 16 },
  petName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  petBreed: { fontSize: 14, color: COLORS.textMedium, marginTop: 2 },
  petAge: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  arrowIcon: { fontSize: 24, color: COLORS.textLight, paddingHorizontal: 4 },

  // Banner inferior
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  heartIcon: { fontSize: 24, marginRight: 12 },
  infoBannerText: { flex: 1, fontSize: 13, color: COLORS.textMedium, lineHeight: 18, fontWeight: '500' },
  emptyText: { textAlign: 'center', color: COLORS.textLight, marginTop: 40, fontSize: 14 }
});