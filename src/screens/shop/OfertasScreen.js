import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OfertasScreen({ navigation }) {
  // Simulación que luego vendrá de tu Base de Datos/API
  const ofertasExclusivas = [
    { id: 'of1', nombre: 'Combo Bienvenida Cachorros', detalle: 'Alimento 2kg + Juguete Mordedor', precio: '$42.000', descuento: '20% OFF', colorBox: '#EBF5FB' },
    { id: 'of2', nombre: 'Shampoo Hipoalergénico', detalle: 'Cuidado de la piel · 500ml', precio: '$18.900', descuento: '15% OFF', colorBox: '#FDEDEC' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.ciruela} />
      
      {/* HEADER EXCLUSIVO DE OFERTAS */}
      <View style={styles.purpleHeader}>
        <View style={styles.topIconsRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFC816" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerSubtitle}>GUARDERÍA BELLA LUNA</Text>
            <Text style={styles.headerTitle}>Ofertas del Mes</Text>
          </View>
          <View style={{ width: 24 }} /> {/* Balanceador visual */}
        </View>
      </View>

      {/* CUERPO DE OFERTAS */}
      <View style={styles.whiteBodyContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.introOfertasText}>
            🔥 Aprovecha estos descuentos especiales preparados para tu peludo este mes:
          </Text>
          
          {ofertasExclusivas.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.productRowCard}
              activeOpacity={0.8}
            >
              <View style={[styles.productImagePlaceholder, { backgroundColor: item.colorBox }]}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>{item.descuento}</Text>
                </View>
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productDetail}>{item.detalle}</Text>
              </View>

              <Text style={styles.productPrice}>{item.precio}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.ciruela },
  purpleHeader: { backgroundColor: COLORS.ciruela, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 25, marginTop: 30 },
  topIconsRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: 4, marginRight: 12 },
  headerTitleContainer: { flex: 1 },
  headerSubtitle: { fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFC816', marginTop: 2 },
  whiteBodyContainer: { flex: 1, backgroundColor: '#F9F9F9', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 30 },
  introOfertasText: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 20, fontWeight: '500' },
  productRowCard: { backgroundColor: '#FFF', borderRadius: 18, borderWidth: 1, borderColor: '#ECECE7', flexDirection: 'row', padding: 12, marginBottom: 12, alignItems: 'center', borderColor: '#FFC816', borderWidth: 1.5 },
  productImagePlaceholder: { width: 55, height: 55, borderRadius: 14, position: 'relative' },
  discountBadge: { backgroundColor: '#E74C3C', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6, position: 'absolute', bottom: -4, right: -4 },
  discountBadgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  productInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  productDetail: { fontSize: 11, color: '#9CA3AF' },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#E67E22', paddingHorizontal: 4 },
});