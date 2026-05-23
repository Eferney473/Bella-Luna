import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Image,
  Alert
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function EditPetScreen({ route, navigation }) {
  // Recibimos la data de la mascota que viene desde la lista
  const { mascota } = route.params;

  // Estados locales para los inputs del formulario
  const [nombre, setNombre] = useState(mascota.nombre);
  const [raza, setRaza] = useState(mascota.raza);
  const [edad, setEdad] = useState(mascota.edad);
  const [genero, setGenero] = useState(mascota.genero);
  const [peso, setPeso] = useState(mascota.peso);
  const [foto, setFoto] = useState(mascota.foto);

  // Función para cambiar o actualizar la foto desde esta pantalla
  const handleChangeFoto = () => {
    const opciones = { mediaType: 'photo', quality: 0.8 };
    Alert.alert(
      "Actualizar foto",
      "Selecciona una opción:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Tomar Foto", 
          onPress: () => launchCamera(opciones, res => !res.didCancel && setFoto(res.assets[0].uri)) 
        },
        { 
          text: "Elegir de Galería", 
          onPress: () => launchImageLibrary(opciones, res => !res.didCancel && setFoto(res.assets[0].uri)) 
        }
      ]
    );
  };

  const handleGuardarCambios = () => {
    if (!nombre || !raza) {
      Alert.alert("Campos vacíos", "Por favor completa al menos el nombre y la raza.");
      return;
    }

    // Aquí empaquetamos el objeto editado completo
    const mascotaEditada = {
      ...mascota,
      nombre,
      raza,
      edad,
      genero,
      peso,
      foto
    };

    // SOLUCIÓN: Enviamos el parámetro de vuelta a la ruta contenedora activa 'Home'
    // y le especificamos que los reciba la pestaña que corresponda.
    Alert.alert("¡Éxito!", "Cambios guardados correctamente.", [
      { 
        text: "OK", 
        onPress: () => {
          navigation.navigate('Home', {
            screen: 'Mascotas', // Asegúrate de que este nombre coincida con el nombre exacto de la pestaña en tu TabNavigator
            params: { mascotaModificada: mascotaEditada },
          });
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor='#70C1B3' />
      
      {/* HEADER DE EDICIÓN */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 40 }} /> {/* Dummy para centrar el título */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* SECCIÓN DE FOTO */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={[styles.avatarContainer, { backgroundColor: mascota.bgColor }]} onPress={handleChangeFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="paw" size={45} color={COLORS.white} />
            )}
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHelpText}>Toca para cambiar la foto</Text>
        </View>

        {/* FORMULARIO */}
        <View style={styles.form}>
          <Text style={styles.label}>Nombre de la mascota</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej. Max" />

          <Text style={styles.label}>Raza / Especie</Text>
          <TextInput style={styles.input} value={raza} onChangeText={setRaza} placeholder="Ej. Golden Retriever" />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Edad</Text>
              <TextInput style={styles.input} value={edad} onChangeText={setEdad} placeholder="Ej. 3 años" />
            </View>
            <View style={[styles.flex1, { marginLeft: 12 }]}>
              <Text style={styles.label}>Peso</Text>
              <TextInput style={styles.input} value={peso} onChangeText={setPeso} placeholder="Ej. 25 kg" />
            </View>
          </View>

          <Text style={styles.label}>Género</Text>
          <View style={styles.genderContainer}>
            {['Macho', 'Hembra'].map(g => (
              <TouchableOpacity 
                key={g} 
                style={[styles.genderButton, genero === g && styles.genderButtonActive]}
                onPress={() => setGenero(g)}
              >
                <Text style={[styles.genderButtonText, genero === g && styles.genderButtonTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BOTÓN GUARDAR */}
        <TouchableOpacity style={styles.saveButton} onPress={handleGuardarCambios} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#70C1B3' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 25,
    paddingBottom: 20,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  content: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24 },
  avatarSection: { alignItems: 'center', marginTop: 25, marginBottom: 20 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.ciruela, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  avatarHelpText: { fontSize: 12, color: '#9CA3AF', marginTop: 8, fontWeight: '500' },
  form: { marginTop: 10 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.ciruela, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 14 : 10, fontSize: 15, color: '#1F2937' },
  row: { flexDirection: 'row' },
  flex1: { flex: 1 },
  genderContainer: { flexDirection: 'row', marginTop: 4 },
  genderButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#F3F4F6', marginRight: 8 },
  genderButtonActive: { backgroundColor: COLORS.ciruela },
  genderButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  genderButtonTextActive: { color: '#FFF' },
  saveButton: { backgroundColor: '#70C1B3', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 35, marginBottom: 40 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});