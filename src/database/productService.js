// src/database/productService.js
import { db } from '../config/firebase';

/**
 * Escuchar los productos de la tienda en tiempo real
 */
export const subscribeToProducts = (onUpdate) => {
  return db.collection('Products')
    .onSnapshot(snapshot => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(productsList);
    }, error => {
      console.error("Error al leer productos de Firestore: ", error);
    });
};