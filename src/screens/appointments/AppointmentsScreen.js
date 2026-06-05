import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

export default function AppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection('appointments')
      .where('ownerId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const list = [];
        if (querySnapshot) {
          querySnapshot.forEach(doc => {
            list.push({ id: doc.id, ...doc.data() });
          });
        }
        setAppointments(list);
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleCancelAppointment = (id, petName) => {
    Alert.alert(
      "Cancelar Cita",
      `¿Deseas cancelar la cita agendada para ${petName}?`,
      [
        { text: "No, mantener", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection('appointments').doc(id).delete();
            } catch (error) {
              Alert.alert("Error", "No se pudo cancelar la cita.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons 
            name={item.service === 'Guardería' ? 'home-heart' : 'shower'} 
            size={24} 
            color={COLORS.white} 
          />
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.petName}>{item.petName}</Text>
          <Text style={styles.serviceText}>{item.service}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.timeInfo}>
          <MaterialCommunityIcons name="calendar-clock" size={16} color={COLORS.textMedium} />
          <Text style={styles.dateTimeText}>{item.date} • {item.time}</Text>
        </View>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancelAppointment(item.id, item.petName)}>
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Citas</Text>
        <Text style={styles.headerSubtitle}>Gestiona las reservas de tus peluditos</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="calendar-blank-outline" size={70} color="#CBD5E0" />
          <Text style={styles.emptyTitle}>No tienes citas agendadas</Text>
          <Text style={styles.emptySubtitle}>Programa tu primer plan de guardería o spa presionando el botón de abajo.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('BookAppointment')}>
        <MaterialCommunityIcons name="calendar-plus" size={26} color={COLORS.white} />
        <Text style={styles.fabText}>Agendar Nueva</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.ciruela },
  headerSubtitle: { fontSize: 14, color: COLORS.textMedium, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  appointmentCard: { backgroundColor: COLORS.white, borderRadius: 18, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: '#EDF2F7', elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 44, height: 44, backgroundColor: COLORS.secondary, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  infoBlock: { flex: 1, marginLeft: 12 },
  petName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  serviceText: { fontSize: 13, color: COLORS.textMedium, marginTop: 1 },
  statusBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: COLORS.primaryDark, fontSize: 11, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeInfo: { flexDirection: 'row', alignItems: 'center' },
  dateTimeText: { fontSize: 13, color: COLORS.textDark, marginLeft: 6, fontWeight: '500' },
  cancelBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FED7D7' },
  cancelBtnText: { color: '#E53E3E', fontSize: 12, fontWeight: '600' },
  emptyContainer: { flex: 0.8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: COLORS.textMedium, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: COLORS.ciruela, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 25, elevation: 4 },
  fabText: { color: COLORS.white, fontWeight: 'bold', marginLeft: 8, fontSize: 14 }
});