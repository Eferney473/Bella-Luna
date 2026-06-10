import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, StatusBar, Platform, Image } from 'react-native';
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
    <TouchableOpacity 
      style={styles.petCard} 
      onPress={() => navigation.navigate('AddPet', { pet: item })}
      activeOpacity={0.85}
    >
      {/* Renderizar foto real si existe, sino el icono de la patita */}
      <View style={[styles.petAvatar, { backgroundColor: item.gender === 'Hembra' ? '#FCC419' : COLORS.primary }]}>
        {item.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.avatarImage} />
        ) : (
          <MaterialCommunityIcons name="paw" size={26} color={COLORS.white} />
        )}
      </View>
      
      {/* Información de la mascota */}
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>{item.breed || 'Sin raza'}</Text>
        
        {/* CORRECCIÓN: Separamos los badges para que carguen independientemente */}
        <View style={styles.badgesRow}>
          {/* Badge de Género */}
          <View style={styles.genderBadge}>
            <Text style={styles.genderBadgeText}>{item.gender || 'Mascota'}</Text>
          </View>

          {/* Badge de Edad independiente */}
          {item.age && (
            <View style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>{item.age}</Text>
            </View>
          )}
          
          {/* Badge de Peso */}
          {item.weight && item.weight !== 'No especificado' && (
            <View style={styles.weightBadge}>
              <Text style={styles.weightBadgeText}>{item.weight}</Text>
            </View>
          )}
        </View>

        {item.notes && item.notes !== 'Ninguna' && (
          <View style={styles.notesBadge}>
            <Text style={styles.notesText} numberOfLines={1}>⚠️ Nota: {item.notes}</Text>
          </View>
        )}
      </View>
      
      {/* Columna Lateral de Acciones */}
      <View style={styles.actionColumn}>
        <View style={styles.actionIconView}>
          <MaterialCommunityIcons name="square-edit-outline" size={20} color="#59374F" />
        </View>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleDeletePet(item.id, item.name)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#E53E3E" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary || '#4FD1C5'} barStyle="light-content" />
      
      <View style={styles.header}>
        <SafeAreaView>
          <Text style={styles.headerTitle}>Mis mascotas</Text>
          <Text style={styles.headerSubtitle}>Tus consentidos registrados en Bella Luna</Text>
        </SafeAreaView>
      </View>

      <View style={styles.bodyContainer}>
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
      </View>

      <TouchableOpacity 
        style={styles.fabButton} 
        onPress={() => navigation.navigate('AddPet')}
        activeOpacity={0.9}
      >
        <MaterialCommunityIcons name="plus" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary || '#70C1B3' },
  header: { 
    paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'ios' ? 30 : 55, 
    paddingBottom: 60,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.white || '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: COLORS.white || '#FFFFFF', marginTop: 3, opacity: 0.9, fontWeight: '500' },
  bodyContainer: { 
    flex: 1, 
    backgroundColor: COLORS.background || '#FAFAFA', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    marginTop: -20, 
    overflow: 'hidden'
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },
  petCard: { 
    flexDirection: 'row', 
    backgroundColor: '#F0F9F6', 
    borderRadius: 20, 
    padding: 14, 
    marginBottom: 16, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E6F4F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2
  },
  petAvatar: { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 18 },
  petInfo: { flex: 1, marginLeft: 14, paddingRight: 4 },
  petName: { fontSize: 17, fontWeight: 'bold', color: COLORS.textDark || '#2D3748' },
  petDetails: { fontSize: 12, color: COLORS.textLight || '#718096', marginTop: 1 },
  badgesRow: { flexDirection: 'row', marginTop: 6, gap: 6, flexWrap: 'wrap' },
  genderBadge: { backgroundColor: '#FAF5FF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  genderBadgeText: { color: COLORS.ciruela || '#5A344E', fontSize: 11, fontWeight: 'bold' },
  ageBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  ageBadgeText: { color: '#D97706', fontSize: 11, fontWeight: 'bold' },
  weightBadge: { backgroundColor: '#EBF8FF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  weightBadgeText: { color: '#a7b02b', fontSize: 11, fontWeight: 'bold' },
  notesBadge: { backgroundColor: '#FFF5F5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 8 },
  notesText: { color: '#E53E3E', fontSize: 11, fontWeight: '600' },
  actionColumn: { justifyContent: 'space-around', height: 65, alignItems: 'center', paddingLeft: 6 },
  actionIconView: { padding: 4, opacity: 0.8 },
  actionButton: { padding: 4 },
  emptyContainer: { flex: 0.8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.textDark, marginTop: 15 },
  emptySubtitle: { fontSize: 13, color: COLORS.textMedium, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  fabButton: { position: 'absolute', bottom: 25, right: 20, backgroundColor: COLORS.secondary || '#FFC0CB', width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 }
});