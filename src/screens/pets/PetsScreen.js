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
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const MASCOTAS_POR_DEFECTO = [
  {
    id: '1',
    nombre: 'Mia',
    raza: 'Criollo',
    edad: '3 años',
    genero: 'Hembra',
    peso: '28 kg',
    fechaNacimiento: '12/04/2021',
    condiciones: 'Sorda',
    notas: 'Le gusta correr en el parque',
    bgColor: '#54D1A3',
    foto: null,
  },
  {
    id: '2',
    nombre: 'Otilio',
    raza: 'Snauzer ',
    edad: '1 años',
    genero: 'Macho',
    peso: '4 kg',
    fechaNacimiento: '25/08/2022',
    condiciones: 'nINGUNA',
    notas: 'Canson rompe todo',
    bgColor: '#FFC816',
    foto: null,
  },
];

export default function PetsScreen({ route, navigation }) {
  const [misMascotas, setMisMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Callback reutilizable para actualizar una mascota en la lista y en disco
  const handleMascotaEditada = (mascotaEditada) => {
    setMisMascotas((prev) => {
      const listaActualizada = prev.map((m) =>
        m.id === mascotaEditada.id ? mascotaEditada : m
      );
      guardarEnDisco(listaActualizada);
      return listaActualizada;
    });
  };

  // Cargar desde almacenamiento local al montar
  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const datosGuardados = await AsyncStorage.getItem('@mis_mascotas_key');
        if (datosGuardados !== null) {
          const datosParseados = JSON.parse(datosGuardados);
          if (Array.isArray(datosParseados) && datosParseados.length > 0) {
            setMisMascotas(datosParseados);
            setCargando(false);
            return;
          }
        }
        setMisMascotas(MASCOTAS_POR_DEFECTO);
      } catch (e) {
        setMisMascotas(MASCOTAS_POR_DEFECTO);
      } finally {
        setCargando(false);
      }
    };
    cargarMascotas();
  }, []);

  // Guardar en almacenamiento local
  const guardarEnDisco = async (nuevaLista) => {
    try {
      await AsyncStorage.setItem('@mis_mascotas_key', JSON.stringify(nuevaLista));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeleccionarImagen = () => {
    const opciones = { mediaType: 'photo', quality: 0.8 };
    Alert.alert(
      'Añadir foto de tu mascota',
      'Selecciona desde dónde quieres subir la foto:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Tomar Foto (Cámara)',
          onPress: () => {
            launchCamera(opciones, (respuesta) => {
              if (!respuesta.didCancel && !respuesta.errorCode && respuesta.assets) {
                agregarNuevaMascotaConFoto(respuesta.assets[0].uri);
              }
            });
          },
        },
        {
          text: 'Elegir de Galería',
          onPress: () => {
            launchImageLibrary(opciones, (respuesta) => {
              if (!respuesta.didCancel && !respuesta.errorCode && respuesta.assets) {
                agregarNuevaMascotaConFoto(respuesta.assets[0].uri);
              }
            });
          },
        },
      ]
    );
  };

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
      fechaNacimiento: '01/01/2023',
      condiciones: 'Ninguna',
      notas: '',
      bgColor: '#70C1B3',
      foto: uriFoto,
    };

    setMisMascotas((prev) => {
      const listaActualizada = [...prev, nuevaMascota];
      guardarEnDisco(listaActualizada);
      return listaActualizada;
    });
  };

  const handleEliminarMascota = (id, nombre) => {
    Alert.alert(
      'Eliminar mascota',
      `¿Estás seguro de que deseas eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setMisMascotas((prev) => {
              const listaActualizada = prev.filter((p) => p.id !== id);
              guardarEnDisco(listaActualizada);
              return listaActualizada;
            });
          },
        },
      ]
    );
  };

  const renderPetCard = ({ item }) => (
    <TouchableOpacity
      style={styles.petCard}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('DetalleMascota', {
          mascota: item,
          onMascotaEditada: handleMascotaEditada,
        })
      }
    >
      <View style={[styles.petIconContainer, { backgroundColor: item.bgColor }]}>
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.petRealImage} />
        ) : (
          <Ionicons name="paw" size={32} color={COLORS.white || '#FFF'} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.petName}>{item.nombre}</Text>
        <Text style={styles.petDetails}>
          {item.raza} · {item.edad}
        </Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: '#FAF5FF' }]}>
            <Text style={[styles.badgeText, { color: COLORS.ciruela || '#2C0E37' }]}>
              {item.genero}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#E6F4EA' }]}>
            <Text style={[styles.badgeText, { color: '#137333' }]}>{item.peso}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('EditPet', {
              mascota: item,
              onMascotaEditada: handleMascotaEditada,
            })
          }
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary || '#149284'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEliminarMascota(item.id, item.nombre)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#70C1B3" />
      <View style={styles.greenHeader}>
        <Text style={styles.headerTitle}>Mis mascotas</Text>
        <Text style={styles.headerSubtitle}>Bella Luna · Como en casa</Text>
      </View>

      <View style={styles.whiteBodyContainer}>
        {cargando ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#70C1B3" />
          </View>
        ) : (
          <FlatList
            data={misMascotas}
            keyExtractor={(item) => item.id}
            renderItem={renderPetCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

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
    paddingTop: Platform.OS === 'ios' ? 15 : 45,
    paddingBottom: 24,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFF', opacity: 0.9, marginTop: 2 },
  whiteBodyContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  listContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  petCard: {
    backgroundColor: '#F0F9F8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECECE7',
    flexDirection: 'row',
    padding: 14,
    marginTop: 14,
    alignItems: 'center',
  },
  petIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  petRealImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoContainer: { flex: 1, marginLeft: 14 },
  petName: { fontSize: 16, fontWeight: 'bold', color: '#2C0E37', marginBottom: 2 },
  petDetails: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  badgeRow: { flexDirection: 'row' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginRight: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 65,
    paddingLeft: 8,
  },
  actionButton: { padding: 6 },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 20,
    backgroundColor: '#FFF',
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
  addIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  addCardText: { color: '#9CA3AF', fontWeight: '600', fontSize: 13 },
});