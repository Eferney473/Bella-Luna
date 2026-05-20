import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  TextInput,
  ScrollView
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const gridCardWidth = (width - 40 - 12) / 2; 

export default function ShopScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const categorias = [
    { id: '1', nombre: 'Alimentos', sublabel: 'Concentrado · Snacks', topBorderColor: '#247BA0' },
    { id: '2', nombre: 'Juguetes', sublabel: 'Accesorios', topBorderColor: '#FFC816' },
    { id: '3', nombre: 'Aseo', sublabel: 'Shampoo · Jabones', topBorderColor: '#F50E0B' },
    { id: '4', nombre: 'Antiparasitarios', sublabel: 'Antipulgas', topBorderColor: '#56A396' },
  ];

  const destacados = [
    { id: '1', nombre: 'Concentrado a granel', detalle: 'Alimentos · por kg', precio: '$8.500/kg', colorBox: '#FEF9E7' },
    { id: '2', nombre: 'Antipulgas pipeta', detalle: 'Antiparasitarios', precio: '$25.000', colorBox: '#E8F8F5' },
  ];

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { borderTopColor: item.topBorderColor }]}
      activeOpacity={0.8}
      onPress={() => alert(`Categoría ${item.nombre}`)}
    >
      <Text style={styles.categoryTitle}>{item.nombre}</Text>
      <Text style={styles.categorySublabel}>{item.sublabel}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.ciruela} />
      
      {/* --- HEADER CIRUELA --- */}
      <View style={styles.purpleHeader}>
        <View style={styles.topIconsRow}>
          <View>
            <Text style={styles.headerSubtitle}>GUARDERÍA BELLA LUNA</Text>
            <Text style={styles.headerTitle}>Tienda</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#FFC816" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CONTENEDOR BLANCO GENERAL --- */}
      <View style={styles.whiteBodyContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          
         {/* --- BARRA DE BÚSQUEDA Y CARRITO DE COMPRAS --- */}
        <View style={styles.searchAndCartRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar en la tienda..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Botón del Carrito con Contador */}
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={() => navigation.navigate('Carrito')} // O la pantalla que maneje tu checkout
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={COLORS.ciruela} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text> 
            </View>
          </TouchableOpacity>
        </View>

          {/* Grilla de Categorías (2 Columnas fijas) */}
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.id}
            renderItem={renderCategoryCard}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false} 
            style={styles.categoriesGrid}
          />

          {/* Título de la Sección Destacados */}
          <Text style={styles.sectionTitle}>Destacados</Text>

          {/* Lista de Productos Destacados */}
          <View style={styles.destacadosContainer}>
            {destacados.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.productRowCard}
                activeOpacity={0.8}
              >
                <View style={[styles.productImagePlaceholder, { backgroundColor: item.colorBox }]} />
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.nombre}</Text>
                  <Text style={styles.productDetail}>{item.detalle}</Text>
                </View>

                <Text style={styles.productPrice}>{item.precio}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.ciruela 
  },
  purpleHeader: {
    backgroundColor: COLORS.ciruela,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 35,
    marginTop:30
  },
  topIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC816', 
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  whiteBodyContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  // Contenedor horizontal para alinear Buscador + Carrito
  searchAndCartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  // Ajuste al contenedor de búsqueda para que comparta fila con el carrito
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 46,
    flex: 1, // Toma todo el espacio disponible dejando el lado derecho libre
    marginRight: 12, // Separación con el carrito
    borderWidth: 1,
    borderColor: '#ECECE7',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  searchIcon: { 
    marginRight: 10 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 14, 
    color: '#1F2937' 
  },
  
// Estilos del Botón del Carrito
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#59374F',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444', // Rojo vibrante para alertas de cantidad
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoriesGrid: {
    marginBottom: 10,
    marginTop: 30,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    width: gridCardWidth,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 4, 
    borderWidth: 1,
    borderColor: '#ECECE7',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.ciruela,
    textAlign: 'center',
    marginBottom: 4,
  },
  categorySublabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.ciruela,
    marginBottom: 16,
    marginTop: 10,
  },
  destacadosContainer: {
    flexDirection: 'column',
  },
  productRowCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECECE7',
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  productImagePlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 14,
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  productDetail: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.ciruela,
    paddingHorizontal: 4,
  },
});