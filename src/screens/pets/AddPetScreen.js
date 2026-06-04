// src/screens/pets/AddPetScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

export default function AddPetScreen({ navigation, route }) {
  // Verificamos si estamos editando una mascota existente
  const editingPet = route.params?.pet || null;

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Si estamos en modo edición, cargamos los datos previos al montar la pantalla
  useEffect(() => {
    if (editingPet) {
      setName(editingPet.name);
      setBreed(editingPet.breed);
      setAge(editingPet.age);
      // Limpiamos el texto ' kg' si se guardó previamente para que solo muestre el número
      setWeight(editingPet.weight ? editingPet.weight.replace(' kg', '') : '');
      setNotes(editingPet.notes === 'Ninguna' ? '' : editingPet.notes);
    }
  }, [editingPet]);

  const handleSavePet = async () => {
    if (!name || !breed || !age) {
      Alert.alert('Campos incompletos', 'Por favor ingresa al menos el nombre, raza y edad.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      
      const petData = {
        name: name.trim(),
        breed: breed.trim(),
        age: age.trim(),
        weight: weight.trim() ? `${weight.trim()} kg` : 'No especificado',
        notes: notes.trim() || 'Ninguna',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (editingPet) {
        // MODO EDICIÓN: Actualizar documento existente
        await firestore().collection('pets').doc(editingPet.id).update(petData);
        Alert.alert('¡Actualizado!', `${name} ha sido actualizado correctamente.`);
      } else {
        // MODO CREACIÓN: Insertar documento nuevo
        petData.ownerId = currentUser.uid;
        petData.createdAt = firestore.FieldValue.serverTimestamp();
        await firestore().collection('pets').add(petData);
        Alert.alert('¡Éxito!', `${name} ha sido registrado(a).`);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editingPet ? 'Editar Mascota' : 'Registrar Mascota'}
        </Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarPlaceholder}>
          <MaterialCommunityIcons name="dog" size={50} color={COLORS.white} />
        </View>
        <Text style={styles.avatarText}>
          {editingPet ? `Modificando el perfil de ${editingPet.name}` : '¡Ponle rostro a tu consentido!'}
        </Text>
      </View>

      {/* FORMULARIO */}
      <View style={styles.form}>
        <Text style={styles.label}>Nombre de la mascota *</Text>
        <TextInput style={styles.input} placeholder="Ej. Max, Luna" placeholderTextColor="#A0AEC0" value={name} onChangeText={setName} />

        <Text style={styles.label}>Raza *</Text>
        <TextInput style={styles.input} placeholder="Ej. Golden Retriever, Criollo" placeholderTextColor="#A0AEC0" value={breed} onChangeText={setBreed} />

        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Edad *</Text>
            <TextInput style={styles.input} placeholder="Ej. 2 años" placeholderTextColor="#A0AEC0" value={age} onChangeText={setAge} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Peso en kg (Opcional)</Text>
            <TextInput style={styles.input} placeholder="Ej. 12" placeholderTextColor="#A0AEC0" keyboardType="numeric" value={weight} onChangeText={setWeight} />
          </View>
        </View>

        <Text style={styles.label}>Condiciones médicas / Notas del Spa</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Ej. Alérgico al pollo, miedo al secador..." placeholderTextColor="#A0AEC0" multiline numberOfLines={4} value={notes} onChangeText={setNotes} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSavePet} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveButtonText}>{editingPet ? 'Guardar Cambios' : 'Registrar Mascota'}</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  backButton: { padding: 4, marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.ciruela },
  avatarSection: { alignItems: 'center', marginBottom: 25 },
  avatarPlaceholder: { width: 90, height: 90, backgroundColor: COLORS.primary, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 13, color: COLORS.textMedium, fontWeight: '500' },
  form: { marginTop: 5 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15, color: COLORS.textDark, marginBottom: 18 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: COLORS.secondary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 10, elevation: 2 },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});