import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';

export default function AppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de control de pestañas y filtros basados en la imagen de referencia
  const [activeTab, setActiveTab] = useState('Activas'); // 'Activas' o 'Historial'
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [petFilters, setPetFilters] = useState([]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    // Escuchador en tiempo real adaptado al índice existente (ownerId + createdAt)
    const unsubscribe = firestore()
      .collection('appointments')
      .where('ownerId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc') // Trae las más recientes primero
      .onSnapshot(querySnapshot => {
        const list = [];
        const uniquePets = new Set();

        if (querySnapshot) {
          querySnapshot.forEach(doc => {
            const data = doc.data();
            list.push({ id: doc.id, ...data });
            if (data.petName) uniquePets.add(data.petName);
          });
        }
        
        setAppointments(list);
        setPetFilters(Array.from(uniquePets));
        setLoading(false);
      }, error => {
        console.error("Error cargando citas: ", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // Lógica de filtrado en tiempo real basada en la pestaña activa y los filtros horizontales
  useEffect(() => {
    let result = [...appointments];

    // 1. Filtrar por Pestaña (Activas vs Historial) de forma estricta según su estado real en la base de datos
    if (activeTab === 'Activas') {
      result = result.filter(item => item.status !== 'Completada' && item.status !== 'Cancelada');
    } else {
      result = result.filter(item => item.status === 'Completada' || item.status === 'Cancelada');
    }

    // 2. Filtrar por la Pastilla Seleccionada (Servicios o Nombres de Mascotas)
    if (selectedFilter !== 'Todas') {
      if (selectedFilter === 'Guardería' || selectedFilter === 'Spa') {
        result = result.filter(item => item.service?.toLowerCase().includes(selectedFilter.toLowerCase()));
      } else {
        result = result.filter(item => item.petName === selectedFilter);
      }
    }

    setFilteredAppointments(result);
  }, [appointments, activeTab, selectedFilter]);

  // Función interna robusta para parsear la fecha a componentes separados
  const renderDateBlock = (dateField) => {
    if (!dateField) return { day: '00', month: 'mes' };
    
    // Si viene como string descriptivo de Firebase (ej: "18 de mayo")
    if (typeof dateField === 'string') {
      const cleanDate = dateField.toLowerCase().replace('de', '').trim();
      const parts = cleanDate.split(/\s+/);
      const day = parts[0] || '00';
      const month = parts[1] ? parts[1].substring(0, 3) : 'mes';
      return { day, month: month.toUpperCase() };
    }
    
    // Si en un futuro viene como Timestamp nativo de JS/Firebase
    try {
      const dateObj = dateField.toDate ? dateField.toDate() : new Date(dateField);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      return { day, month: months[dateObj.getMonth()] };
    } catch (e) {
      return { day: '00', month: 'MES' };
    }
  };

  // Badge dinámico según el estado exacto de la cita
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Confirmada':
        return { bg: '#E6F4EA', text: '#137333' };
      case 'Pendiente':
        return { bg: '#FEF3E2', text: '#B06000' };
      case 'Cancelada':
        return { bg: '#FCE8E6', text: '#C5221F' };
      case 'Completada':
        return { bg: '#E8F0FE', text: '#1A73E8' };
      default:
        return { bg: '#F1F3F4', text: '#5F6368' };
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const { day, month } = renderDateBlock(item.date);
    const statusStyle = getStatusStyles(item.status);

    return (
      <TouchableOpacity 
        style={styles.cardContainer}
        onPress={() => navigation.navigate('AppointmentDetails', { appointment: item })}
        activeOpacity={0.85}
      >
        {/* Bloque de fecha izquierdo */}
        <View style={styles.dateBlock}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
        </View>

        {/* Bloque central de información */}
        <View style={styles.infoBlock}>
          <Text style={styles.serviceTitle} numberOfLines={1}>{item.service || 'Servicio'}</Text>
          <Text style={styles.serviceSubtitle} numberOfLines={1}>
            {item.subService || (item.service === 'Guardería' ? 'Guardería diurna' : 'Spa canino')}
          </Text>
          
          {/* Fila con el nombre de la mascota */}
          <View style={styles.petRow}>
            <MaterialCommunityIcons name="paw" size={14} color={COLORS.oro || '#FCC419'} />
            <Text style={styles.petNameText}>{item.petName || 'Mascota sin nombre'}</Text>
          </View>
        </View>

        {/* Bloque derecho con Estado y Precio */}
        <View style={styles.rightBlock}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status || 'Pendiente'}</Text>
          </View>
          <Text style={styles.priceText}>
            {item.price ? (item.price.toString().startsWith('$') ? item.price : `$ ${item.price}`) : '$ --.--'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.ciruela || '#59374F'} barStyle="light-content" />
      
      {/* HEADER SUPERIOR OSCURO (ESTILO CIRUELA) */}
      <View style={styles.premiumHeader}>
        <SafeAreaView>
          <Text style={styles.brandSubtitle}>GUARDERÍA BELLA LUNA</Text>
          
          <View style={styles.headerTopRow}>
            <Text style={styles.mainTitle}>Mis citas</Text>
          </View>

          {/* Selector de pestañas superiores (Activas / Historial) */}
          <View style={styles.tabBarContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'Activas' && styles.tabButtonActive]}
              onPress={() => { setActiveTab('Activas'); setSelectedFilter('Todas'); }}
            >
              <Text style={[styles.tabButtonText, activeTab === 'Activas' && styles.tabButtonTextActive]}>
                Activas {appointments.filter(c => c.status !== 'Completada' && c.status !== 'Cancelada').length > 0 ? `(${appointments.filter(c => c.status !== 'Completada' && c.status !== 'Cancelada').length})` : ''}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'Historial' && styles.tabButtonActive]}
              onPress={() => { setActiveTab('Historial'); setSelectedFilter('Todas'); }}
            >
              <Text style={[styles.tabButtonText, activeTab === 'Historial' && styles.tabButtonTextActive]}>
                Historial
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* CUERPO BLANCO CURVADO */}
      <View style={styles.whiteBodyContainer}>
        
        {/* CAROUSEL HORIZONTAL DE FILTROS EN PASTILLAS */}
        <View style={{ height: 50, marginTop: 20, marginBottom: 5 }}>
          <FlatList
            horizontal
            data={['Todas', 'Guardería', 'Spa', ...petFilters]}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContainer}
            renderItem={({ item }) => {
              const isSelected = selectedFilter === item;
              return (
                <TouchableOpacity
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setSelectedFilter(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* LISTADO DE CITAS ESTILIZADO */}
        {loading ? (
          <View style={styles.centerElement}>
            <ActivityIndicator size="large" color={COLORS.primary || '#4FD1C5'} />
          </View>
        ) : filteredAppointments.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={65} color="#CBD5E0" />
            <Text style={styles.emptyStateTitle}>No se encontraron citas</Text>
            <Text style={styles.emptyStateSubtitle}>
              No hay registros que coincidan con la pestaña o filtro seleccionado en este momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAppointments}
            keyExtractor={item => item.id}
            renderItem={renderAppointmentItem}
            contentContainerStyle={styles.appointmentsListContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* BOTÓN FLOTANTE (FAB) PARA NUEVAS CITAS - UNIFICADO CON EL ESTILO DE LA APP */}
      <TouchableOpacity 
        style={styles.fabButton} 
        onPress={() => navigation.navigate('BookAppointment')}
        activeOpacity={0.9}
      >
        <MaterialCommunityIcons name="plus" size={28} color={COLORS.white || '#FFFFFF'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.ciruela || '#59374F' },
  
  /* ESTILOS DEL HEADER PREMIUM */
  premiumHeader: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 30 : 55,
    paddingBottom: 25,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  /* SWITCH DE PASTILLAS (ACTIVAS / HISTORIAL) */
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    fontSize: 14,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* CONTENEDOR DEL FORMULARIO INFERIOR CURVADO */
  whiteBodyContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  filtersScrollContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: COLORS.ciruela || '#59374F',
    borderColor: COLORS.ciruela || '#59374F',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#718096',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* DISEÑO EXACTO DE LAS TARJETAS DE CITA */
  appointmentsListContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 100, // Espacio suficiente para no tapar el contenido con el FAB
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0F4F8',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  dateBlock: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.ciruela || '#59374F',
    lineHeight: 26,
  },
  dateMonth: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '700',
  },
  infoBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  petNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  rightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3748',
    marginTop: 6,
  },

  /* ELEMENTOS VACÍOS O DE CARGA */
  centerElement: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4A5568',
    marginTop: 14,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  
  /* BOTÓN FLOTANTE ESTILIZADO (FAB) */
  fabButton: { 
    position: 'absolute', 
    bottom: 25, 
    right: 20, 
    backgroundColor: COLORS.secondary || '#FFC0CB', 
    width: 54, 
    height: 54, 
    borderRadius: 27, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 3 
  }
});