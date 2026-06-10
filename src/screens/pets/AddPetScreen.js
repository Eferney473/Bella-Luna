import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, StatusBar, Platform, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

export default function AddPetScreen({ navigation, route }) {
  const editingPet = route.params?.pet || null;

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('Macho');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPet) {
      setName(editingPet.name);
      setBreed(editingPet.breed);
      setAge(editingPet.age ? editingPet.age.trim() : '');
      setWeight(editingPet.weight ? editingPet.weight.replace(' kg', '') : '');
      setGender(editingPet.gender || 'Macho');
      setPhotoUri(editingPet.photoUri || null);
      setNotes(editingPet.notes === 'Ninguna' ? '' : editingPet.notes);
    } else {
      setName('');
      setBreed('');
      setAge('');
      setWeight('');
      setGender('Macho');
      setPhotoUri(null);
      setNotes('');
    }
  }, [editingPet, route.params]);

  const imagePickerOptions = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.8,
    includeBase64: false,
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('El usuario canceló la selección');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Hubo un problema al acceder a la cámara o galería.');
    } else if (response.assets && response.assets.length > 0) {
      const selectedUri = response.assets[0].uri;
      setPhotoUri(selectedUri); 
    }
  };

  const handleSelectImage = () => {
    Alert.alert(
      'Seleccionar Foto',
      'Elige el origen para la imagen de tu consentido:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Tomar Foto (Cámara)', 
          onPress: () => {
            launchCamera(imagePickerOptions, handleImageResponse);
          } 
        },
        { 
          text: 'Seleccionar de Galería', 
          onPress: () => {
            launchImageLibrary(imagePickerOptions, handleImageResponse);
          } 
        },
      ]
    );
  };

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
        gender: gender, 
        weight: weight.trim() ? `${weight.trim()} kg` : 'No especificado',
        notes: notes.trim() || 'Ninguna',
        photoUri: photoUri, 
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (editingPet) {
        await firestore().collection('pets').doc(editingPet.id).update(petData);
        Alert.alert('¡Actualizado!', `${name} ha sido actualizado correctamente.`);
      } else {
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
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary || '#4FD1C5'} barStyle="light-content" />
      
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.headerNavigationRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white || '#FFFFFF'} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {editingPet ? 'Editar Perfil' : 'Registrar Mascota'}
            </Text>
            <View style={{ width: 24 }} /> 
          </View>

          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarTouchable} onPress={handleSelectImage} activeOpacity={0.9}>
              <View style={styles.avatarPlaceholder}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.avatarImage} />
                ) : (
                  <MaterialCommunityIcons name="dog" size={48} color={COLORS.ciruela || '#59374F'} />
                )}
                <View style={styles.cameraBadge}>
                  <MaterialCommunityIcons name="camera" size={14} color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarText}>
              {editingPet ? `Modificando a ${name}` : '¡Ponle rostro a tu consentido!'}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.bodyContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          
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
              <Text style={styles.label}>Peso en kg</Text>
              <TextInput style={styles.input} placeholder="Ej. 12" placeholderTextColor="#A0AEC0" keyboardType="numeric" value={weight} onChangeText={setWeight} />
            </View>
          </View>

          <Text style={styles.label}>Género *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={[styles.genderOption, gender === 'Macho' && styles.genderSelectedMacho]} 
              onPress={() => setGender('Macho')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="gender-male" size={20} color={gender === 'Macho' ? COLORS.white : '#718096'} />
              <Text style={[styles.genderText, gender === 'Macho' && styles.genderTextSelected]}>Macho</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.genderOption, gender === 'Hembra' && styles.genderSelectedHembra]} 
              onPress={() => setGender('Hembra')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="gender-female" size={20} color={gender === 'Hembra' ? COLORS.white : '#718096'} />
              <Text style={[styles.genderText, gender === 'Hembra' && styles.genderTextSelected]}>Hembra</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Condiciones médicas / Notas del Spa</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Ej. Alérgico al pollo, miedo al secador..." placeholderTextColor="#A0AEC0" multiline numberOfLines={4} value={notes} onChangeText={setNotes} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSavePet} disabled={loading} activeOpacity={0.9}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveButtonText}>{editingPet ? 'Guardar Cambios' : 'Registrar Mascota'}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary || '#4FD1C5' },
  headerBackground: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 30 : 55, 
    paddingBottom: 35 
  },
  headerNavigationRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white || '#FFFFFF', textAlign: 'center' },
  avatarSection: { alignItems: 'center', marginTop: 10 },
  avatarTouchable: { position: 'relative' },
  avatarPlaceholder: { 
    width: 95, 
    height: 95, 
    backgroundColor: '#FAFAFA', 
    borderRadius: 47.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden' 
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 47.5 },
  cameraBadge: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    backgroundColor: COLORS.secondary || '#FFC0CB', 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FAFAFA'
  },
  avatarText: { fontSize: 13, color: COLORS.white || '#FFFFFF', fontWeight: '600', opacity: 0.95 },
  bodyContainer: { 
    flex: 1, 
    backgroundColor: COLORS.background || '#FAFAFA', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    marginTop: -15, 
    overflow: 'hidden' 
  },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 25, paddingBottom: 30 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.textDark || '#2D3748', marginBottom: 8 },
  input: { backgroundColor: COLORS.white || '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: COLORS.textDark || '#2D3748', marginBottom: 18 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  genderContainer: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  genderOption: { flex: 1, flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  genderSelectedMacho: { backgroundColor: COLORS.ciruela || '#59374F', borderColor: COLORS.primary || '#4FD1C5' },
  genderSelectedHembra: { backgroundColor: '#FCC419', borderColor: '#FCC419' }, 
  genderText: { fontSize: 14, fontWeight: '600', color: '#718096' },
  genderTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  textArea: { height: 95, textAlignVertical: 'top' },
  saveButton: { backgroundColor: COLORS.secondary || '#FFC0CB', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginBottom: 35, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  saveButtonText: { color: COLORS.white || '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

