// src/database/bookingService.js
import { db } from '../config/firebase';

/**
 * Guardar una nueva reserva en Firebase Firestore
 */
export const subscribeToUserBookings = (userId, onUpdate) => {
  return db.collection('Bookings')
    .where('userId', '==', userId)
    .onSnapshot(snapshot => {
      const bookingsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenamos por fecha de creación o de cita si es necesario
      onUpdate(bookingsList);
    }, error => {
      console.error("Error al obtener el historial de Firestore: ", error);
    });
};