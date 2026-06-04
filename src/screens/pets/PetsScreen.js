// src/screens/pets/PetsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

export default function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection('pets')
      .where('ownerId', '==', currentUser.uid)
      .onSnapshot(querySnapshot => {
        const petsList = [];
        if (querySnapshot) {
          querySnapshot.forEach(doc => {
            petsList.push({ id: doc.id, ...doc.data() });
          });
        }
        setPets(petsList);
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // Función para confirmar si desea eliminar la mascota
  const handleDeletePet = (id, name) => {
    Alert.alert(
      "Eliminar Mascota",
      `¿Estás seguro de que deseas eliminar a ${name}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection('pets').doc(id).delete();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la mascota.");
            }
          }
        }
      ]
    );
  };

  const renderPetItem = ({ item }) => (
    // Al presionar la tarjeta, viajamos a AddPet pero pasándole los datos del 'item' como parámetros
    <TouchableOpacity 
      style={styles.petCard} 
      onPress={() => navigation.navigate('AddPet', { pet: item })}
    >
      <View style={styles.petAvatar}>
        <MaterialCommunityIcons name="paw" size={26} color={COLORS.white} />
      </View>
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>{item.breed} • {item.age}</Text>
        {item.notes && item.notes !== 'Ninguna' && (
          <View style={styles.notesBadge}>
            <Text style={styles.notesText} numberOfLines={1}>⚠️ Nota: {item.notes}</Text>
          </View>
        )}
      </View>
      
      {/* Botón sutil para eliminar */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDeletePet(item.id, item.name)}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#E53E3E" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Mascotas</Text>
        <Text style={styles.headerSubtitle}>Tus consentidos registrados en Bella Luna</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="dog-side" size={80} color="#CBD5E0" />
          <Text style={styles.emptyTitle}>Aún no tienes mascotas</Text>
          <Text style={styles.emptySubtitle}>Registra a tus peluditos para que puedan agendar planes de Guardería y Spa.</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={item => item.id}
          renderItem={renderPetItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={styles.fabButton} 
        onPress={() => navigation.navigate('AddPet')} // Va vacío = Modo Crear
      >
        <MaterialCommunityIcons name="plus" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.ciruela },
  headerSubtitle: { fontSize: 14, color: COLORS.textMedium, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  petCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 18, padding: 16, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#EDF2F7', elevation: 1 },
  petAvatar: { width: 52, height: 52, backgroundColor: COLORS.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  petInfo: { flex: 1, marginLeft: 15, paddingRight: 10 },
  petName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  petDetails: { fontSize: 13, color: COLORS.textMedium, marginTop: 2 },
  notesBadge: { backgroundColor: '#FFF5F5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6 },
  notesText: { color: '#E53E3E', fontSize: 11, fontWeight: '600' },
  deleteButton: { padding: 8 },
  emptyContainer: { flex: 0.8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: COLORS.textMedium, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  fabButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: COLORS.secondary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});