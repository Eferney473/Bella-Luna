// src/database/petService.js
import { db } from '../config/firebase';

/**
 * Obtener las mascotas de un usuario en específico en tiempo real
 */
export const subscribeToUserPets = (userId, onUpdate) => {
  return db.collection('Pets')
    .where('ownerId', '==', userId)
    .onSnapshot(snapshot => {
      const petsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(petsList);
    }, error => {
      console.error("Error al obtener mascotas de Firestore: ", error);
    });
};

/**
 * Método temporal para simular la inserción de una nueva mascota (Para pruebas rápidas)
 */
export const addMockPet = async (userId, nombre, especie, raza, edad) => {
  try {
    await db.collection('Pets').add({
      ownerId: userId,
      nombre: nombre,
      especie: especie,
      raza: raza,
      edad: edad,
      fechaNacimiento: '2023-04-12',
      genero: 'Macho',
      peso: '12 kg',
      condicionesMedicas: 'Ninguna',
      notas: 'Muy amigable',
      fotoUrl: '' // Espacio para Storage a futuro
    });
    console.log("Mascota agregada con éxito");
  } catch (error) {
    console.error("Error al guardar mascota: ", error);
  }
};