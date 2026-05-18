import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  FlatList, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Platform 
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const columnWidth = (width - 44) / 2; // Garantiza que las 2 columnas queden perfectamente simétricas

export default function ShopScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [categorySelected, setCategorySelected] = useState('Todos');

  // Categorías comerciales del PetShop
  const categorias = ['Todos', 'Alimentos', 'Juguetes', 'Accesorios', 'Higiene'];

  // Datos dummy mapeados usando los assets reales que tienes en tu proyecto
  const productos = [
    {
      id: '1',
      nombre: 'Alimento Premium Adulto',
      categoria: 'Alimentos',
      precio: '$35.000',
      img: require('../../assets/comida.png'), // Cambiar por tu asset de comida si varía el nombre
    },
    {
      id: '2',
      nombre: 'Juguete Mordedor Hueso',
      categoria: 'Juguetes',
      precio: '$12.500',
      img: require('../../assets/shopPet.jpeg'), // Usando tu asset visualizado en la estructura
    },
    {
      id: '3',
      nombre: 'Collar Ajustable Reflectivo',
      categoria: 'Accesorios',
      precio: '$18.000',
      img: require('../../assets/shopPet.jpeg'), // Usando tu asset visualizado en la estructura
    },
    {
      id: '4',
      nombre: 'Shampoo Hipoalergénico',
      categoria: 'Higiene',
      precio: '$22.000',
      img: require('../../assets/spaaaa.jpeg'), // Usando tu asset visualizado en la estructura
    },
  ];

  // Render para los botones de filtros horizontales
  const renderCategoryItem = ({ item }) => {
    const isSelected = categorySelected === item;
    return (
      <TouchableOpacity 
        style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
        onPress={() => setCategorySelected(item)}
        activeOpacity={0.8}
      >
        <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render para la grilla de productos en 2 columnas
  const renderProductCard = ({ item }) => {
    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
          <Image source={item.img} style={styles.productImage} resizeMode="cover" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{item.precio}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => console.log('Añadido al carrito:', item.nombre)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Filtrado lógico por categorías
  const productosFiltrados = categorySelected === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria === categorySelected);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tienda</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => console.log('Ir al carrito')}>
          <Ionicons name="basket-outline" size={26} color={COLORS.ciruela} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* --- INPUT DE BÚSQUEDA --- */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar snacks, juguetes, collares..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* --- CATEGORÍAS HORIZONTALES --- */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categorias}
          keyExtractor={(item) => item}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* --- REJILLA DE PRODUCTOS COMERCIALES --- */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    marginTop: 50
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela },
  cartButton: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },

  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textDark },

  categoriesWrapper: { marginBottom: 16 },
  categoriesList: { paddingHorizontal: 16 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.ciruela,
  },
  categoryText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  categoryTextActive: { color: COLORS.white, fontWeight: 'bold' },

  gridContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { justifyContent: 'space-between' },
  productCard: {
    backgroundColor: COLORS.white,
    width: columnWidth,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F9FAFB',
  },
  productImage: { width: '100%', height: '100%' },
  infoContainer: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, height: 40, marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: COLORS.ciruela },
  addButton: {
    backgroundColor: COLORS.primary || '#149284',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  }
});