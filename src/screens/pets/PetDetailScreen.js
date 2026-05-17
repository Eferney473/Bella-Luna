// src/screens/pets/PetDetailScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  ScrollView 
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function PetDetailScreen({ route, navigation }) {
  const { pet } = route.params; // Captura la mascota enviada desde el listado

  const infoRows = [
    { label: '📅 Fecha de nacimiento', value: pet.fechaNacimiento || '10/05/2021' },
    { label: '🧬 Género', value: pet.genero || 'Hembra' },
    { label: '⚖️ Peso', value: pet.peso || '24 kg' },
    { label: '🩺 Condiciones médicas', value: pet.condicionesMedicas || 'Ninguna' },
    { label: '📝 Notas', value: pet.notas || 'Es muy juguetona' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* --- REQUISITO: BOTÓN VOLVER NATIIV0 --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Mascota</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- AREA AVATAR CENTRAL --- */}
        <View style={styles.avatarContainer}>
          <Image 
            source={pet.especie === 'Gato' ? require('../../assets/perros.jpeg') : require('../../assets/guarderia1.jpeg')} 
            style={styles.bigAvatar} 
          />
          <Text style={styles.petName}>{pet.nombre}</Text>
          <Text style={styles.petBreed}>{pet.raza}</Text>
        </View>

        {/* --- TABLA DE DATOS TÉCNICOS --- */}
        <View style={styles.infoTable}>
          {infoRows.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  backButton: { paddingVertical: 50 },
  backText: { fontSize: 24, color: COLORS.secondary, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela },
  editButton: { padding: 4 },
  scrollContent: { paddingBottom: 32 },

  // Avatar block
  avatarContainer: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  bigAvatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: COLORS.primaryLight },
  petName: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark, marginTop: 12 },
  petBreed: { fontSize: 15, color: COLORS.textMedium, marginTop: 4 },

  // Tabla informativa
  infoTable: { marginHorizontal: 20, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, overflow: 'hidden' },
  tableRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border 
  },
  rowLabel: { fontSize: 14, color: COLORS.textMedium, fontWeight: '500' },
  rowValue: { fontSize: 14, color: COLORS.textDark, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 16 }
});