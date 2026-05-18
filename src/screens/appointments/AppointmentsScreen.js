// src/screens/appointments/AppointmentsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { subscribeToUserBookings } from '../../database/bookingService';

const USER_ID_TEST = "user_ana_123"; // ID simulado

export default function AppointmentsScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Conexión en tiempo real a Firebase Firestore
    const unsubscribe = subscribeToUserBookings(USER_ID_TEST, (list) => {
      if (list.length === 0) {
        // Datos de prueba locales por si la base de datos está vacía al inicio
        setBookings([
          { id: '1', servicio: 'Guardería', mascota: 'Luna', fecha: '14/05/2026', horario: '08:00 AM', precio: 45000, status: 'Completada' },
          { id: '2', servicio: 'Spa & Baño', mascota: 'Luna', fecha: '10/05/2026', horario: '02:30 PM', precio: 35000, status: 'Completada' },
          { id: '3', servicio: 'Paseo Programado', mascota: 'Luna', fecha: '02/05/2026', horario: '10:00 AM', precio: 20000, status: 'Completada' }
        ]);
      } else {
        setBookings(list);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceBadge}>
          <Text style={styles.serviceText}>
            {item.servicio === 'Guardería' ? '🏠' : item.servicio === 'Spa & Baño' ? '🧼' : '🐾'} {item.servicio}
          </Text>
        </View>
        {/* Badge de estado usando color Menta (Primary) */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status || 'Completada'}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.infoLine}>
          <Text style={styles.label}>Mascota: </Text>{item.mascota}
        </Text>
        <Text style={styles.infoLine}>
          <Text style={styles.label}>Fecha: </Text>{item.fecha}  |  <Text style={styles.label}>Hora: </Text>{item.horario}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>Total abonado:</Text>
        <Text style={styles.totalPrice}>${item.precio.toLocaleString('es-CO')}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
        <Text style={styles.subtitle}>Historial de servicios tomados</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No registras ningún servicio agendado todavía.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela, marginTop: 50 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },

  // Tarjeta de Historial
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    paddingBottom: 10,
    marginBottom: 12
  },
  serviceBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  serviceText: { fontSize: 13, fontWeight: 'bold', color: COLORS.textDark },
  statusBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },

  // Cuerpo de la tarjeta
  cardBody: { marginBottom: 12 },
  infoLine: { fontSize: 14, color: COLORS.textMedium, marginBottom: 4 },
  label: { fontWeight: '600', color: COLORS.textDark },

  // Footer de la tarjeta
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    paddingTop: 10
  },
  totalLabel: { fontSize: 13, color: COLORS.oro, fontWeight: 'bold' },
  totalPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela }
});