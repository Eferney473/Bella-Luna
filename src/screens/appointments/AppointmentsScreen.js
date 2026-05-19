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
  Platform
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function AppointmentsScreen({ route, navigation }) {
  const [activeTab, setActiveTab] = useState('proximas');

  // Estado mutable para las próximas citas para que reciba las nuevas reservas en tiempo real
  const [citasProximas, setCitasProximas] = useState([
    {
      id: '1',
      tipo: 'servicio',
      servicio: 'Spa & Estética',
      mascota: 'Luna',
      fecha: '20 Mayo',
      hora: '10:00 AM',
      estado: 'Confirmada',
      icon: 'sparkles-outline',
    },
    {
      id: '2',
      tipo: 'servicio',
      servicio: 'Guardería por Día',
      mascota: 'Luna',
      fecha: '25 Mayo',
      hora: '08:00 AM',
      estado: 'Pendiente',
      icon: 'home-outline',
    },
  ]);

  const historialActividad = [
    {
      id: '3',
      tipo: 'servicio',
      servicio: 'Paseo Vespertino',
      mascota: 'Luna',
      fecha: '15 Mayo',
      hora: '04:00 PM',
      estado: 'Completado',
      icon: 'walk-outline',
    },
    {
      id: '4',
      tipo: 'compra',
      servicio: 'Alimento Premium & Juguete',
      mascota: null,
      fecha: '12 Mayo',
      hora: '11:30 AM',
      estado: 'Entregado',
      icon: 'bag-handle-outline',
      total: '$45.000'
    },
  ];

  // Escuchador de parámetros de React Navigation para capturar nuevas citas creadas en caliente
  useEffect(() => {
    if (route.params?.nuevaCita) {
      const citaRecibida = route.params.nuevaCita;
      
      setCitasProximas((prevCitas) => {
        // Evitamos duplicar la cita si la pantalla se re-renderiza por otra razón
        const existe = prevCitas.some(c => c.id === citaRecibida.id);
        if (existe) return prevCitas;
        return [citaRecibida, ...prevCitas]; // La inserta al inicio de la lista
      });
      
      // Forzamos la vista a la pestaña "Próximas" para ver el cambio instantáneo
      setActiveTab('proximas');
    }
  }, [route.params?.nuevaCita]);

  const getStatusStyle = (item) => {
    if (item.tipo === 'compra') {
      return { bg: '#EBF5FF', text: '#1E40AF' }; // Azul premium para compras
    }
    switch (item.estado) {
      case 'Confirmada':
        return { bg: '#E6F4EA', text: '#137333' }; // Verde
      case 'Pendiente':
        return { bg: '#FFF7ED', text: '#C2410C' }; // Naranja moderno
      case 'Completado':
      default:
        return { bg: '#F3F4F6', text: '#4B5563' }; // Gris neutro
    }
  };

  const renderItemCard = ({ item }) => {
    const statusColor = getStatusStyle(item);
    const splitFecha = item.fecha.split(' ');
    const dia = splitFecha[0] || '';
    const mes = splitFecha[1] || '';

    return (
      <View style={styles.appointmentCard}>
        {/* Bloque Izquierdo Estilizado (Fecha) */}
        <View style={styles.dateBlock}>
          <Text style={styles.dateTextDay}>{dia}</Text>
          <Text style={styles.dateTextMonth}>{mes.toUpperCase()}</Text>
        </View>

        {/* Bloque Central con Jerarquía de Textos */}
        <View style={styles.detailsBlock}>
          <View style={styles.serviceTitleRow}>
            <View style={[styles.iconWrapper, { backgroundColor: item.tipo === 'compra' ? '#F0F6FF' : '#FAF5FF' }]}>
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={item.tipo === 'compra' ? '#2563EB' : COLORS.ciruela} 
              />
            </View>
            <Text style={styles.serviceName} numberOfLines={1}>{item.servicio}</Text>
          </View>
          
          {item.tipo === 'servicio' ? (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Mascota:</Text>
              <Text style={styles.metaValue}>{item.mascota}</Text>
            </View>
          ) : (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Monto:</Text>
              <Text style={[styles.metaValue, styles.priceValue]}>{item.total}</Text>
            </View>
          )}
          
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={13} color="#9CA3AF" style={{ marginRight: 4 }} />
            <Text style={styles.timeText}>{item.hora}</Text>
          </View>
        </View>

        {/* Bloque Derecho: Badge de Estado tipo Píldora */}
        <View style={styles.statusBlock}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {item.tipo === 'compra' ? 'Compra' : item.estado}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F6" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Actividad y Citas</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('ReservarServicio', { servicio: 'Guardería' })}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* --- TAB SELECTOR TIPO PÍLDORA FLOTANTE --- */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'proximas' && styles.activeTab]}
            onPress={() => setActiveTab('proximas')}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabText, activeTab === 'proximas' && styles.activeTabText]}>
              Próximas Citas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'historial' && styles.activeTab]}
            onPress={() => setActiveTab('historial')}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabText, activeTab === 'historial' && styles.activeTabText]}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- LISTADO --- */}
      <FlatList
        data={activeTab === 'proximas' ? citasProximas : historialActividad}
        keyExtractor={(item) => item.id}
        renderItem={renderItemCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyText}>No hay registros para mostrar aquí</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F6' },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 20,
    margin: 50,
    backgroundColor: '#F9F9F6',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela },
  addButton: {
    backgroundColor: COLORS.primary || '#149284',
    width: 42,
    height: 42,
    marginLeft: 30,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  tabWrapper: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECECE7',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 21,
  },
  activeTab: {
    backgroundColor: COLORS.white || '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C7C75',
  },
  activeTabText: {
    color: COLORS.ciruela || '#1F2937',
    fontWeight: 'bold',
  },

  listContainer: { paddingHorizontal: 16, paddingBottom: 40 },

  appointmentCard: {
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateBlock: {
    backgroundColor: '#FAF9F5',
    borderWidth: 1,
    borderColor: '#ECECE7',
    borderRadius: 16,
    width: 64,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateTextDay: { fontSize: 20, fontWeight: 'bold', color: COLORS.ciruela },
  dateTextMonth: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginTop: 2, letterSpacing: 0.5 },
  
  detailsBlock: { flex: 1, justifyContent: 'center' },
  serviceTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  iconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', flex: 1 },
  
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaLabel: { fontSize: 13, color: '#6B7280', marginRight: 4 },
  metaValue: { fontSize: 13, fontWeight: '600', color: '#374151' },
  priceValue: { color: '#10B981' },

  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  timeText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },

  statusBlock: { justifyContent: 'center', alignItems: 'flex-end', marginLeft: 6 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ECECE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
});