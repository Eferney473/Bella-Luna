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
  Platform,
  ScrollView
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function AppointmentsScreen({ route, navigation }) {
  // Pestaña principal: Activas o Historial
  const [activeTab, setActiveTab] = useState('proximas');
  // Filtro secundario horizontal (por tipo o mascota)
  const [activeFilter, setActiveFilter] = useState('Todas');

  // Próximas citas (Activas)
  const [citasProximas, setCitasProximas] = useState([
    { id: '1', tipo: 'servicio', servicio: 'Spa & Estética', mascota: 'Luna', fecha: '05 Mayo', hora: '10:00 AM', estado: 'Confirmada', icon: 'sparkles-outline' },
    { id: '2', tipo: 'servicio', servicio: 'Guardería por Día', mascota: 'Max', fecha: '28 Mayo', hora: '08:00 AM', estado: 'Pendiente', icon: 'home-outline' },
  ]);

  // Historial de actividad concluida
  const [historialActividad, setHistorialActividad] = useState([
    { id: '3', tipo: 'servicio', servicio: 'Baño + Corte', mascota: 'Luna', fecha: '05 Mayo', hora: '04:00 PM', estado: 'Completada', icon: 'cut-outline', precio: '$58.000' },
    { id: '4', tipo: 'servicio', servicio: 'Plan Sol', mascota: 'Max', fecha: '28 Mayo', hora: '11:30 AM', estado: 'Completada', icon: 'sunny-outline', precio: '$55.000' },
    { id: '5', tipo: 'servicio', servicio: 'Plan Bella Luna', mascota: 'Max', fecha: '12 Abril', hora: '09:00 AM', estado: 'Completada', icon: 'moon-outline', precio: '$90.000' },
  ]);

  // Escuchador de parámetros para nuevas reservas
  useEffect(() => {
    if (route.params?.nuevaCita) {
      const citaRecibida = route.params.nuevaCita;
      setCitasProximas((prevCitas) => {
        const existe = prevCitas.some(c => c.id === citaRecibida.id);
        if (existe) return prevCitas;
        return [citaRecibida, ...prevCitas];
      });
      setActiveTab('proximas');
    }
  }, [route.params?.nuevaCita]);

  // Filtros dinámicos horizontales basados en la guía
  const filtros = ['Todas', 'Guardería', 'Spa', 'Max', 'Luna'];

  // Filtrado lógico de los datos de la lista
  const dataActual = activeTab === 'proximas' ? citasProximas : historialActividad;
  const dataFiltrada = dataActual.filter(item => {
    if (activeFilter === 'Todas') return true;
    if (activeFilter === 'Guardería') return item.servicio.toLowerCase().includes('guardería') || item.servicio.toLowerCase().includes('sol') || item.servicio.toLowerCase().includes('bella');
    if (activeFilter === 'Spa') return item.servicio.toLowerCase().includes('spa') || item.servicio.toLowerCase().includes('baño');
    if (activeFilter === 'Max') return item.mascota === 'Max';
    if (activeFilter === 'Luna') return item.mascota === 'Luna';
    return true;
  });

  // Estilos de badges según el estado visual de la guía
  const getStatusStyle = (estado) => {
    switch (estado) {
      case 'Confirmada':
        return { bg: '#E6F4EA', text: '#137333' };
      case 'Pendiente':
        return { bg: '#FFF7ED', text: '#C2410C' };
      case 'Completada':
      default:
        return { bg: '#E6F4EA', text: '#137333' }; // Verde sutil de completado en la guía
    }
  };

  const renderItemCard = ({ item }) => {
    const statusColor = getStatusStyle(item.estado);
    const [dia, mes] = item.fecha.split(' ');

    return (
      <View style={styles.appointmentCard}>
        {/* Bloque Izquierdo (Fecha grande estilizada) */}
        <View style={styles.dateBlock}>
          <Text style={styles.dateTextDay}>{dia}</Text>
          <Text style={styles.dateTextMonth}>{mes?.toLowerCase()}</Text>
        </View>

        {/* Bloque Central (Información de la cita) */}
        <View style={styles.detailsBlock}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.servicio}</Text>
          <Text style={styles.metaSublabel}>
            {item.servicio.toLowerCase().includes('spa') || item.servicio.toLowerCase().includes('baño') ? 'Spa canino' : 'Guardería diurna'} · {item.mascota}
          </Text>
          
          {/* Ficha/Avatar de la mascota en miniatura */}
          <View style={styles.mascotaBadgeRow}>
            <View style={styles.avatarPug}>
              <Ionicons name="paw" size={10} color={COLORS.white} />
            </View>
            <Text style={styles.mascotaBadgeText}>{item.mascota}</Text>
          </View>
        </View>

        {/* Bloque Derecho (Precio y Estado) */}
        <View style={styles.rightBlock}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>{item.estado}</Text>
          </View>
          <Text style={styles.cardPrice}>{item.precio || '$ --.--'}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.ciruela} />
      
      {/* --- PURPLE HEADER UNIFICADO (Fiel a la Guía) --- */}
      <View style={styles.purpleHeader}>
        <View style={styles.topHeaderRow}>
          <View>
            <Text style={styles.headerSubtitle}>GUARDERÍA BELLA LUNA</Text>
            <Text style={styles.headerTitle}>Mis citas</Text>
          </View>
          
          {/* Botón "+ Nueva" inteligente basado en el filtro actual */}
          <TouchableOpacity 
            style={styles.floatingAddButton} 
            onPress={() => {
              // Si el usuario está parado en el filtro "Spa", pre-seleccionamos 'Spa'.
              // En cualquier otro caso ("Todas", "Guardería" o filtros de mascotas), viaja con 'Guardería' por defecto.
              const servicioDestino = activeFilter === 'Spa' ? 'Spa' : 'Guardería';
              
              navigation.navigate('ReservarServicio', { servicio: servicioDestino });
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={COLORS.ciruela} style={{ marginRight: 2 }} />
            <Text style={styles.addBtnText}>Nueva</Text>
          </TouchableOpacity>
        </View>

        {/* Selector de Pestaña Principal (Activas / Historial) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'proximas' && styles.tabActiveButton]}
            onPress={() => { setActiveTab('proximas'); setActiveFilter('Todas'); }}
          >
            <Text style={[styles.tabButtonText, activeTab === 'proximas' && styles.tabActiveButtonText]}>
              Activas <Text style={styles.badgeCount}>2</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'historial' && styles.tabActiveButton]}
            onPress={() => { setActiveTab('historial'); setActiveFilter('Todas'); }}
          >
            <Text style={[styles.tabButtonText, activeTab === 'historial' && styles.tabActiveButtonText]}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CUERPO BLANCO CONTENEDOR --- */}
      <View style={styles.whiteContentArea}>
        
        {/* Filtros Horizontales Secundarios */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {filtros.map((filtro) => (
              <TouchableOpacity
                key={filtro}
                style={[styles.filterChip, activeFilter === filtro && styles.activeFilterChip]}
                onPress={() => setActiveFilter(filtro)}
              >
                <Text style={[styles.filterChipText, activeFilter === filtro && styles.activeFilterChipText]}>
                  {filtro}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mes de cabecera indicativo */}
        <Text style={styles.monthSectionTitle}>
          {activeTab === 'proximas' ? 'Mayo 2026' : 'Historial de Actividad'}
        </Text>

        {/* Listado Principal de Citas */}
        <FlatList
          data={dataFiltrada}
          keyExtractor={(item) => item.id}
          renderItem={renderItemCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay citas registradas en este filtro</Text>
            </View>
          }
        />

        {/* --- BARRA INFERIOR DE TOTAL INVERTIDO (Solo en pestaña Historial) --- */}
        {activeTab === 'historial' && (
          <View style={styles.totalInvertedFooter}>
            <Text style={styles.totalFooterText}>
              Total invertido en Bella Luna <Text style={styles.totalFooterAmount}>$213.000</Text>
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.ciruela },
  
  // Header Estilo Premium Guía
  purpleHeader: { 
    backgroundColor: COLORS.ciruela, 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 10 : 35, 
    paddingBottom: 25 
  },
  topHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20
  },
  headerSubtitle: { fontSize: 11, color: 'rgba(255, 255, 255, 0.7)', letterSpacing: 1, fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginTop: 2 },
  
  // Botón + Nueva Arriba
  floatingAddButton: {
    backgroundColor: '#FFC816',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  addBtnText: { color: COLORS.ciruela, fontWeight: 'bold', fontSize: 13 },

  // Selector Pill Activas / Historial
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
  },
  tabActiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  tabButtonText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' },
  tabActiveButtonText: { color: '#FFF', fontWeight: 'bold' },
  badgeCount: { fontSize: 11, color: '#FFC816' },

  // Cuerpo Blanco Redondeado
  whiteContentArea: { 
    flex: 1, 
    backgroundColor: '#F9F9F9', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    overflow: 'hidden'
  },

  // Filtros Horizontales
  filtersWrapper: { marginTop: 15, marginBottom: 10 },
  filtersScroll: { paddingHorizontal: 20, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ECECE7',
  },
  activeFilterChip: {
    backgroundColor: COLORS.ciruela,
    borderColor: COLORS.ciruela,
  },
  filterChipText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  activeFilterChipText: { color: '#FFF', fontWeight: 'bold' },

  monthSectionTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.ciruela, paddingHorizontal: 22, marginTop: 10, marginBottom: 12, letterSpacing: 0.3 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },

  // Tarjetas Estilo Guía
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    flexDirection: 'row',
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0EE',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  dateBlock: {
    width: 58,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dateTextDay: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela, lineHeight: 26 },
  dateTextMonth: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginTop: 1 },
  
  detailsBlock: { flex: 1, justifyContent: 'center' },
  serviceName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  metaSublabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 6 },
  
  // Avatar Redondo del perro interno
  mascotaBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  avatarPug: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFC816', justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  mascotaBadgeText: { fontSize: 11, color: '#6B7280', fontWeight: '500' },

  rightBlock: { alignItems: 'flex-end', justifyContent: 'space-between', height: 55 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.ciruela, marginTop: 4 },

  // Footer de Inversión Total
  totalInvertedFooter: {
    backgroundColor: '#F3EBF1',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(89, 55, 79, 0.1)',
  },
  totalFooterText: { fontSize: 13, color: COLORS.ciruela, fontWeight: '600' },
  totalFooterAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela },

  emptyContainer: { alignItems: 'center', marginTop: 40, padding: 20 },
  emptyText: { fontSize: 13, color: '#9CA3AF', marginTop: 10, textAlign: 'center' }
});