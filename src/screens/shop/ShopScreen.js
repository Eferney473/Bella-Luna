import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar, 
  FlatList, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { subscribeToProducts } from '../../database/productService';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Cálculo exacto para 2 columnas con márgenes

export default function ShopScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Conexión en tiempo real a Firestore
    const unsubscribe = subscribeToProducts((productsList) => {
      // Si la colección está vacía en Firebase, cargamos unos por defecto para pruebas
      if (productsList.length === 0) {
        setProducts([
          { id: '1', nombre: 'Alimento Premium Perro', precio: 85000, marca: 'BellaNutri', img: require('../../assets/flyer2.jpeg'), tag: 'Top' },
          { id: '2', nombre: 'Juguete Mordedor Gato', precio: 18000, marca: 'PetPlay', img: require('../../assets/petshop.jpeg'), tag: 'Nuevo' },
          { id: '3', nombre: 'Collar Estilizado Ciruela', precio: 32000, marca: 'BellaLuna', img: require('../../assets/spa.jpeg'), tag: '' },
          { id: '4', nombre: 'Snacks Naturales Uni', precio: 15000, marca: 'DoggyTreats', img: require('../../assets/guarderia1.jpeg'), tag: 'Oferta' },
        ]);
      } else {
        setProducts(productsList);
      }
    });

    return () => unsubscribe();
  }, []);

  // Filtrar productos según lo que escriba el usuario en el buscador
  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      {/* Etiqueta dinámica (Top, Nuevo, Oferta) usando el color ORO */}
      {item.tag ? (
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      ) : null}

      <Image source={typeof item.img === 'number' ? item.img : { uri: item.fotoUrl }} style={styles.productImage} />
      
      <View style={styles.productDetails}>
        <Text style={styles.productBrand}>{item.marca}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
        
        {/* Precio destacado en ORO o CIRUELA */}
        <Text style={styles.productPrice}>${item.precio.toLocaleString('es-CO')}</Text>
      </View>

      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>+ Agregar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* --- BARRA SUPERIOR DE BÚSQUEDA --- */}
      <View style={styles.searchHeader}>
        <Text style={styles.title}>PetShop</Text>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar alimento, juguetes..."
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* --- GRILLA DE PRODUCTOS (2 Columnas) --- */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron productos compatibles.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  
  // Header y Buscador
  searchHeader: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 12 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.surface, 
    borderRadius: 20, 
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 45
  },
  searchIcon: { marginRight: 8, fontSize: 16 },
  searchInput: { flex: 1, color: COLORS.textDark, fontSize: 14, paddingVertical: 0 },

  // Estructura de la Grilla
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { justifyContent: 'space-between' },

  // Tarjeta de Producto
  productCard: {
    backgroundColor: COLORS.white,
    width: cardWidth,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productImage: { width: '100%', height: 120, resizeMode: 'cover', backgroundColor: COLORS.surface },
  
  // Badges (Etiquetas de Descuento/Top)
  tagBadge: { 
    position: 'absolute', 
    top: 8, 
    left: 8, 
    backgroundColor: COLORS.oro, 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 8, 
    zIndex: 1 
  },
  tagText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },

  // Detalles del texto
  productDetails: { padding: 12, flex: 1 },
  productBrand: { fontSize: 11, color: COLORS.textLight, fontWeight: '600', textTransform: 'uppercase' },
  productName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark, marginTop: 2, height: 40 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.ciruela, marginTop: 6 },

  // Botón Agregar al Carrito
  addToCartButton: { 
    backgroundColor: COLORS.primary, 
    paddingVertical: 10, 
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  addToCartText: { color: COLORS.white, fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', color: COLORS.textLight, marginTop: 40, fontSize: 14 }
});