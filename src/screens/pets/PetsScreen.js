import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Alert,
  Platform,
  Image
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
// 1. IMPORTAMOS LA LIBRERÍA DE LA CÁMARA
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

export default function PetsScreen({ route, navigation }) {
  
  const [misMascotas, setMisMascotas] = useState([
    {
      id: '1',
      nombre: 'Max',
      raza: 'Golden Retriever',
      edad: '3 años',
      genero: 'Macho',
      peso: '28 kg',
      bgColor: '#54D1A3',
      foto: null, // Guardará la URI de la imagen real
    },
    {
      id: '2',
      nombre: 'Luna',
      raza: 'Gato persa',
      edad: '2 años',
      genero: 'Hembra',
      peso: '4 kg',
      bgColor: '#FFC816',
      foto: null,
    },
  ]);

  // Escucha activa y segura de modificaciones al regresar
  useEffect(() => {
    if (route?.params?.mascotaModificada) {
      const modificada = route.params.mascotaModificada;
      
      // Actualizamos el estado con la información nueva
      setMisMascotas(prev => prev.map(m => m.id === modificada.id ? modificada : m));
      
      // Limpiamos el parámetro para que no se repita la lógica innecesariamente
      navigation.setParams({ mascotaModificada: undefined });
    }
  }, [route?.params?.mascotaModificada]);

  // 2. FUNCIÓN MANEJO DE CÁMARA Y GALERÍA
  const handleSeleccionarImagen = () => {
    const opciones = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    Alert.alert(
      "Añadir foto de tu mascota",
      "Selecciona desde dónde quieres subir la foto:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Tomar Foto (Cámara)", 
          onPress: () => {
            launchCamera(opciones, (respuesta) => {
              if (!respuesta.didCancel && !respuesta.errorCode) {
                const uriObtenida = respuesta.assets[0].uri;
                agregarNuevaMascotaConFoto(uriObtenida);
              }
            });
          }
        },
        { 
          text: "Elegir de Galería", 
          onPress: () => {
            launchImageLibrary(opciones, (respuesta) => {
              if (!respuesta.didCancel && !respuesta.errorCode) {
                const uriObtenida = respuesta.assets[0].uri;
                agregarNuevaMascotaConFoto(uriObtenida);
              }
            });
          }
        }
      ]
    );
  };

  // Creación dinámica inyectando la foto real capturada
  const agregarNuevaMascotaConFoto = (uriFoto) => {
    const nombresEjemplo = ['Rocco', 'Coco', 'Milo', 'Bella', 'Toby'];
    const razasEjemplo = ['Beagle', 'Pug', 'Husky', 'Siamés', 'Poodle'];
    
    const nuevaMascota = {
      id: Date.now().toString(),
      nombre: nombresEjemplo[Math.floor(Math.random() * nombresEjemplo.length)],
      raza: razasEjemplo[Math.floor(Math.random() * razasEjemplo.length)],
      edad: '1 año',
      genero: Math.random() > 0.5 ? 'Macho' : 'Hembra',
      peso: '10 kg',
      bgColor: COLORS.ciruela,
      foto: uriFoto, 
    };
    setMisMascotas(prev => [...prev, nuevaMascota]);
  };

  const handleEliminarMascota = (id, nombre) => {
    Alert.alert(
      "Eliminar mascota",
      `¿Estás seguro de que deseas eliminar la ficha de ${nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => setMisMascotas(prev => prev.filter(p => p.id !== id)) }
      ]
    );
  };

  const renderPetCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.petCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('DetalleMascota', { mascota: item })}
    >
      <View style={[styles.petIconContainer, { backgroundColor: item.bgColor }]}>
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.petRealImage} />
        ) : (
          <Ionicons name="paw" size={32} color={COLORS.white} />
        )}
      </View>

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

      <View style={styles.actionContainer}>
        {/* Usamos un callback para evitar alertas involuntarias en la carga */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('EditPet', { mascota: item })}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary || '#149284'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEliminarMascota(item.id, item.nombre)}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor='#70C1B3' />
      
      {/* --- HEADER CON FONDO VERDE MENTA (CORREGIDO ESPACIADO) --- */}
      <View style={styles.greenHeader}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Mis mascotas</Text>
          <Text style={styles.headerSubtitle}>Bella Luna · Como en casa</Text>
        </View>
      </View>

      {/* --- CONTENEDOR BLANCO GENERAL PARA LAS TARJETAS --- */}
      <View style={styles.whiteBodyContainer}>
        
        {/* Listado puro de tarjetas */}
        <FlatList
          data={misMascotas}
          keyExtractor={(item) => item.id}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* --- BOTÓN DE AGREGAR POSICIONADO ABAJO EN FORMA DE FOOTER FIJO --- */}
        <View style={styles.footerContainer}>
          <TouchableOpacity 
            style={styles.addCardDashed} 
            activeOpacity={0.7} 
            onPress={handleSeleccionarImagen}
          >
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={26} color={COLORS.primary || '#149284'} />
            </View>
            <Text style={styles.addCardText}>Agregar mascota</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#70C1B3' },
  greenHeader: {
    backgroundColor: '#70C1B3',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 15 : 45, // Ofrece el margen perfecto para librar la muesca y barra de estado
    paddingBottom: 24,
  },
  headerTextGroup: { flexDirection: 'column' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: 13, color: COLORS.white, opacity: 0.9, marginTop: 2 },
  
  whiteBodyContainer: { 
    flex: 1, 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    overflow: 'hidden' 
  },
  listContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  
  petCard: {
    backgroundColor: COLORS.primaryLight || '#F0F9F8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECECE7',
    flexDirection: 'row',
    padding: 14,
    marginTop: 14,
    alignItems: 'center',
  },
  petIconContainer: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  petRealImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoContainer: { flex: 1, marginLeft: 14 },
  petName: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 2 },
  petDetails: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  badgeRow: { flexDirection: 'row' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginRight: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  actionContainer: { alignItems: 'center', justifyContent: 'space-around', height: 65, paddingLeft: 8 },
  actionButton: { padding: 6 },
  
  // Contenedor del botón inferior para mantener la simetría perfecta
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 20, // Altura adecuada para barras de gestos
    backgroundColor: COLORS.white,
  },
  addCardDashed: {
    backgroundColor: '#E8F6F4',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  addCardText: { color: '#9CA3AF', fontWeight: '600', fontSize: 13 },
});