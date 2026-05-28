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
  TextInput
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const gridCardWidth = (width - 40 - 12) / 2; 

export default function ShopScreen({ navigation }) {
  const [search, setSearch] = useState('');
  
  // Estado para saber qué categoría está seleccionada (null significa "Todas")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const categorias = [
    { id: '1', nombre: 'Alimentos', sublabel: 'Concentrado · Snacks', topBorderColor: '#247BA0' },
    { id: '2', nombre: 'Juguetes', sublabel: 'Accesorios', topBorderColor: '#FFC816' },
    { id: '3', nombre: 'Aseo', sublabel: 'Shampoo · Jabones', topBorderColor: '#F50E0B' },
    { id: '4', nombre: 'Antiparasitarios', sublabel: 'Antipulgas', topBorderColor: '#56A396' },
  ];

  // Base de datos de productos (cada uno amarrado al nombre de su categoría)
  const todosLosProductos = [
    { id: '1', nombre: 'Concentrado a granel', detalle: 'Alimentos · por kg', precio: '$8.500/kg', colorBox: '#FEF9E7', categoria: 'Alimentos' },
    { id: '2', nombre: 'Antipulgas pipeta', detalle: 'Antiparasitarios', precio: '$25.000', colorBox: '#E8F8F5', categoria: 'Antiparasitarios' },
    { id: '3', nombre: 'Pelota de Goma', detalle: 'Juguetes divertidos', precio: '$12.000', colorBox: '#EBF5FB', categoria: 'Juguetes' },
    { id: '4', nombre: 'Shampoo Pelaje Blanco', detalle: 'Aseo · 500ml', precio: '$18.500', colorBox: '#FADBD8', categoria: 'Aseo' },
    { id: '5', nombre: 'Snacks de Hígado', detalle: 'Alimentos · Premios', precio: '$6.000', colorBox: '#FEF9E7', categoria: 'Alimentos' },
  ];

  // FILTRADO DINÁMICO: Filtra por categoría pulsada Y ADEMÁS por el texto del buscador
  const productosFiltrados = todosLosProductos.filter(producto => {
    const cumpleCategoria = categoriaSeleccionada ? producto.categoria === categoriaSeleccionada : true;
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(search.toLowerCase());
    return cumpleCategoria && cumpleBusqueda;
  });

  // Manejador al oprimir una categoría
  const handlePresionarCategoria = (nombreCategoria) => {
    if (categoriaSeleccionada === nombreCategoria) {
      setCategoriaSeleccionada(null); // Si vuelve a tocar la misma, quita el filtro (muestra todo)
    } else {
      setCategoriaSeleccionada(nombreCategoria); // Filtra por la categoría seleccionada
    }
  };

  const renderCategoryCard = ({ item }) => {
    const estaActiva = categoriaSeleccionada === item.nombre;
    return (
      <TouchableOpacity 
        style={[
          styles.categoryCard, 
          { borderTopColor: item.topBorderColor },
          estaActiva && styles.categoryCardActiva // Estilo extra si está seleccionada
        ]}
        activeOpacity={0.8}
        onPress={() => handlePresionarCategoria(item.nombre)}
      >
        <Text style={styles.categoryTitle}>{item.nombre}</Text>
        <Text style={styles.categorySublabel}>{item.sublabel}</Text>
        {estaActiva && <Text style={styles.activeDot}>• Filtrado</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.ciruela} />
      
      {/* HEADER DE TIENDA */}
      <View style={styles.purpleHeader}>
        <View style={styles.topIconsRow}>
          <View>
            <Text style={styles.headerSubtitle}>GUARDERÍA BELLA LUNA</Text>
            <Text style={styles.headerTitle}>Tienda</Text>
          </View>
          
          {/* CAMBIO 1: El Carrito ahora está aquí arriba a la derecha */}
          <TouchableOpacity 
            style={styles.cartButtonHeader} 
            onPress={() => navigation.navigate('Carrito')} 
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={26} color="#FFC816" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text> 
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* CUERPO PRINCIPAL */}
      <View style={styles.whiteBodyContainer}>
        
        {/* CAMBIO 2: Buscador más grande ocupando el 100% del ancho */}
        <View style={styles.searchRowFull}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={categoriaSeleccionada ? `Buscar en ${categoriaSeleccionada}...` : "Buscar en la tienda..."}
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista total usando FlatList como contenedor para evitar ScrollView anidado */}
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          
          // HEADER DE LA LISTA: Ponemos las categorías arriba de los productos
          ListHeaderComponent={
            <View>
              <Text style={styles.sectionTitle}>Categorías</Text>
              <FlatList
                data={categorias}
                keyExtractor={(item) => item.id}
                renderItem={renderCategoryCard}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                scrollEnabled={false} 
                style={styles.categoriesGrid}
              />
              <View style={styles.titleWithResetRow}>
                <Text style={styles.sectionTitleNoMargin}>
                  {categoriaSeleccionada ? `Resultados de: ${categoriaSeleccionada}` : 'Productos Destacados'}
                </Text>
                {categoriaSeleccionada && (
                  <TouchableOpacity onPress={() => setCategoriaSeleccionada(null)}>
                    <Text style={styles.resetFilterText}>Ver todos</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          }
          
          // RENDERIZADO DE LOS PRODUCTOS
          renderItem={({ item }) => (
            <TouchableOpacity 
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
          )}

          // Mensaje si no hay productos que coincidan con el filtro o búsqueda
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={40} color="#9CA3AF" />
              <Text style={styles.emptyText}>No encontramos productos en esta categoría.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.ciruela },
  purpleHeader: { backgroundColor: COLORS.ciruela, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 25, marginTop: 30 },
  topIconsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFC816', marginTop: 2 },
  cartButtonHeader: { padding: 6, position: 'relative' },
  cartBadge: { position: 'absolute', top: -2, right: -4, backgroundColor: '#EF4444', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  whiteBodyContainer: { flex: 1, backgroundColor: '#F9F9F9', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  searchRowFull: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 5 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, alignItems: 'center', paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: '#ECECE7', elevation: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#1F2937' },
  scrollContainer: { paddingHorizontal: 20, pb: 30, paddingTop: 10, paddingBottom: 40 },
  categoriesGrid: { marginBottom: 10, marginTop: 10 },
  gridRow: { justifyContent: 'space-between', marginBottom: 14 },
  categoryCard: { backgroundColor: '#FFF', width: gridCardWidth, borderRadius: 16, paddingVertical: 18, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderTopWidth: 4, borderWidth: 1, borderColor: '#ECECE7', elevation: 2 },
  categoryCardActiva: { backgroundColor: '#E8F8F5', borderColor: '#56A396' },
  categoryTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.ciruela, textAlign: 'center', marginBottom: 4 },
  categorySublabel: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },
  activeDot: { fontSize: 11, color: '#149284', fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.ciruela, marginBottom: 10, marginTop: 10 },
  sectionTitleNoMargin: { fontSize: 16, fontWeight: '600', color: COLORS.ciruela },
  titleWithResetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 15 },
  resetFilterText: { color: '#247BA0', fontWeight: 'bold', fontSize: 13 },
  productRowCard: { backgroundColor: '#FFF', borderRadius: 18, borderWidth: 1, borderColor: '#ECECE7', flexDirection: 'row', padding: 12, marginBottom: 12, alignItems: 'center', elevation: 1 },
  productImagePlaceholder: { width: 55, height: 55, borderRadius: 14 },
  productInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  productDetail: { fontSize: 11, color: '#9CA3AF' },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.ciruela, paddingHorizontal: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 30, paddingHorizontal: 20 },
  emptyText: { color: '#9CA3AF', fontSize: 14, marginTop: 8, textAlign: 'center' }
});