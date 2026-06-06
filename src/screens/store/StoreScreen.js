import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 52) / 2; // Cálculo matemático exacto para dos columnas responsivas

export default function StoreScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cartCount, addToCart } = useCart(); 

  const categories = [
    { id: 'alimentos', title: 'Alimentos', subtitle: 'Concentrado', icon: 'bone', color: '#3182CE' },
    { id: 'juguetes', title: 'Juguetes', subtitle: 'Accesorios', icon: 'tennisball', color: '#D69E2E' },
    { id: 'aseo', title: 'Aseo', subtitle: 'Shampoo', icon: 'shower', color: '#E53E3E' },
    { id: 'antiparasitarios', title: 'Antíparasitos', subtitle: 'Pipetas', icon: 'shield-bug', color: '#319795' },
  ];

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('products')
      .onSnapshot(querySnapshot => {
        const productsList = [];
        if (querySnapshot && !querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            productsList.push({ id: doc.id, ...doc.data() });
          });
        } else {
          productsList.push(
            { id: 'f1', name: 'Concentrado Cachorro', category: 'alimentos', price: 8500, subText: 'Por Kilogramo' },
            { id: 'f2', name: 'Pipeta Antipulgas', category: 'antiparasitarios', price: 25000, subText: 'Dosis única' }
          );
        }
        setProducts(productsList);
        setLoading(false);
      }, error => {
        console.log("Error leyendo productos: ", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedCategory || product.category === selectedCategory)
  );

  const formatCurrency = (value) => {
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.ciruela || '#5A344E'} barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerSubtitle}>GUARDERÍA BELLA LUNA</Text>
          <Text style={styles.headerTitle}>Tienda</Text>
        </View>

        <TouchableOpacity style={styles.cartHeaderButton} onPress={() => navigation.navigate('Cart')}>
          <MaterialCommunityIcons name="cart-outline" size={26} color="#F6AD55" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.whiteSheetContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          
          {/* BARRA DE BUSQUEDA */}
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={22} color="#A0AEC0" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar productos..."
              placeholderTextColor="#A0AEC0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* BOTONES DE CATEGORÍAS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity 
                  key={cat.id}
                  style={[
                    styles.categoryTab, 
                    isSelected && { backgroundColor: '#5A344E', borderColor: '#5A344E' }
                  ]}
                  onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                >
                  <MaterialCommunityIcons name={cat.icon} size={16} color={isSelected ? '#FFFFFF' : '#718096'} style={{marginRight: 6}} />
                  <Text style={[styles.categoryTabLabel, isSelected && { color: '#FFFFFF' }]}>{cat.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.destacadosHeaderRow}>
            <Text style={styles.sectionTitle}>Productos en vitrina</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearFilterText}>Ver todos</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* GRILLA DE PRODUCTOS EN DOS COLUMNAS */}
          {loading ? (
            <ActivityIndicator size="small" color="#5A344E" style={{ marginTop: 20 }} />
          ) : filteredProducts.length > 0 ? (
            <View style={styles.gridContainer}>
              {filteredProducts.map((item) => (
                <View key={item.id} style={styles.productGridCard}>
                  {/* Icono superior indicando categoría */}
                  <View style={[styles.productImageWrapper, { backgroundColor: item.category === 'alimentos' ? '#FEFCBF' : '#E6FFFA' }]}>
                    <MaterialCommunityIcons 
                      name={item.category === 'alimentos' ? 'bone' : 'pill'} 
                      size={28} 
                      color={item.category === 'alimentos' ? '#B7791F' : '#319795'} 
                    />
                  </View>
                  
                  {/* Detalles del Producto */}
                  <View style={styles.productDetailsContainer}>
                    <Text style={styles.productGridName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.productGridSubtext} numberOfLines={1}>{item.subText || item.category}</Text>
                    
                    {/* Fila de precio y botón añadir */}
                    <View style={styles.priceActionRow}>
                      <Text style={styles.productGridPrice}>
                        {typeof item.price === 'number' ? formatCurrency(item.price) : item.price}
                      </Text>
                      <TouchableOpacity style={styles.addGridButton} onPress={() => addToCart(item)}>
                        <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="store-search" size={42} color="#CBD5E0" />
              <Text style={styles.emptyText}>No encontramos artículos en esta sección.</Text>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#5A344E' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 30 : 55, paddingBottom: 25 },
  headerSubtitle: { color: '#E2E8F0', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  headerTitle: { color: '#F6AD55', fontSize: 28, fontWeight: 'bold', marginTop: 2 },
  cartHeaderButton: { padding: 6, position: 'relative' },
  cartBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#E53E3E', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  whiteSheetContainer: { flex: 1, backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollPadding: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, height: 46, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, elevation: 1 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#2D3748', padding: 0 },
  
  categoriesScroll: { marginBottom: 20, flexDirection: 'row' },
  categoryTab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#EDF2F7', height: 38 },
  categoryTabLabel: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  
  destacadosHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748' },
  clearFilterText: { color: '#3182CE', fontSize: 12, fontWeight: '600' },
  
  /* DISEÑO DE GRILLA DE DOS COLUMNAS */
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productGridCard: { width: cardWidth, backgroundColor: '#FFFFFF', borderRadius: 18, marginBottom: 16, borderWidth: 1, borderColor: '#EDF2F7', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 },
  productImageWrapper: { width: '100%', height: 110, justifyContent: 'center', alignItems: 'center' },
  productDetailsContainer: { padding: 12 },
  productGridName: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  productGridSubtext: { fontSize: 11, color: '#A0AEC0', marginTop: 2 },
  priceActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  productGridPrice: { fontSize: 14, fontWeight: 'bold', color: '#5A344E' },
  addGridButton: { backgroundColor: '#5A344E', width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  
  emptyContainer: { padding: 40, alignItems: 'center', width: '100%' },
  emptyText: { color: '#A0AEC0', fontSize: 13, marginTop: 8, textAlign: 'center' }
});