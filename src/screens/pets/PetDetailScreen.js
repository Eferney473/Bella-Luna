import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PetDetailScreen({ route, navigation }) {
  const { mascota, onMascotaEditada } = route.params;

  const [currentMascota, setCurrentMascota] = useState(mascota);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.mascota) {
        setCurrentMascota(route.params.mascota);
      }
    });
    return unsubscribe;
  }, [navigation, route.params?.mascota]);

  const handleIrAEditar = () => {
    navigation.navigate('EditPet', {
      mascota: currentMascota,
      onMascotaEditada: (mascotaEditada) => {
        setCurrentMascota(mascotaEditada);
        if (onMascotaEditada) {
          onMascotaEditada(mascotaEditada);
        }
      },
    });
  };

  const renderDetailItem = (icon, label, value, isLast = false) => (
    <View style={[styles.infoRow, isLast && styles.lastRow]}>
      <View style={styles.labelGroup}>
        <Text style={styles.iconPlaceholder}>{icon}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={[styles.valueText, label === 'Notas' && styles.notesValue]}>
        {value || 'No especificado'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F6" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.ciruela || '#4A154B'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Mascota</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleIrAEditar}>
          <Ionicons name="create-outline" size={22} color={COLORS.ciruela || '#4A154B'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            {currentMascota.foto ? (
              <Image source={{ uri: currentMascota.foto }} style={styles.petImage} />
            ) : (
              <View
                style={[
                  styles.petImage,
                  styles.defaultAvatar,
                  { backgroundColor: currentMascota.bgColor || '#70C1B3' },
                ]}
              >
                <Ionicons name="paw" size={60} color="#FFFFFF" />
              </View>
            )}
          </View>
          <Text style={styles.petName}>{currentMascota.nombre}</Text>
          <Text style={styles.petBreed}>{currentMascota.raza}</Text>
        </View>

        <View style={styles.unifiedCard}>
          {renderDetailItem(
            '📅',
            'Fecha de nacimiento',
            currentMascota.fechaNacimiento || 'No especificada'
          )}
          {renderDetailItem('⚧', 'Género', currentMascota.genero)}
          {renderDetailItem('⚖️', 'Peso', currentMascota.peso)}
          {renderDetailItem(
            '🩺',
            'Condiciones médicas',
            currentMascota.condiciones || 'Ninguna'
          )}
          {renderDetailItem(
            '📝',
            'Notas',
            currentMascota.notes || currentMascota.notas || 'Sin notas adicionales',
            true
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F6' },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F6',
  },
  backButton: { width: 40, justifyContent: 'center', marginTop: 50 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A154B',
    textAlign: 'center',
    flex: 1,
    marginTop: 50,
  },
  editButton: { width: 40, alignItems: 'flex-end', justifyContent: 'center', marginTop: 50 },
  profileContainer: { alignItems: 'center', marginTop: 16, marginBottom: 24 },
  avatarWrapper: { position: 'relative', width: 140, height: 140 },
  petImage: { width: 140, height: 140, borderRadius: 70, resizeMode: 'cover' },
  defaultAvatar: { justifyContent: 'center', alignItems: 'center' },
  petName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginTop: 14 },
  petBreed: { fontSize: 15, color: '#6B7280', marginTop: 2 },
  unifiedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastRow: { borderBottomWidth: 0 },
  labelGroup: { flexDirection: 'row', alignItems: 'center' },
  iconPlaceholder: { fontSize: 18, marginRight: 12 },
  labelText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  valueText: { fontSize: 16, color: '#1F2937', fontWeight: '400' },
  notesValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
    color: '#4B5563',
    fontWeight: '500',
  },
});