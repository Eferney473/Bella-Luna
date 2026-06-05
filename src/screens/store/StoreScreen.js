import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, ActivityIndicator, StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from '../../config/colors';
import { useCart } from '../../context/CartContext'; // Contexto global activo

export default function StoreScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traemos el conteo y la acción de agregar del contexto global
  const { cartCount, addToCart } = useCart(); 

  const categories = [
    { id: 'alimentos', title: 'Alimentos', subtitle: 'Concentrado · Snacks', icon: 'bone', color: '#3182CE' },
    { id: 'juguetes', title: 'Juguetes', subtitle: 'Accesorios', icon: 'tennisball', color: '#D69E2E' },
    { id: 'aseo', title: 'Aseo', subtitle: 'Shampoo · Jabones', icon: 'shower', color: '#E53E3E' },
    { id: 'antiparasitarios', title: 'Antiparasitarios', subtitle: 'Antipulgas', icon: 'shield-bug', color: '#319795' },
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
            { id: 'f1', name: 'Concentrado a granel', category: 'alimentos', price: 8500, subText: 'Alimentos · por kg' },
            { id: 'f2', name: 'Antipulgas pipeta', category: 'antiparasitarios', price: 25000, subText: 'Antiparasitarios' }
          );
        }
        setProducts(productsList);
        setLoading(false);
      }, error => {
        console.log("Error leyendo productos de la tienda: ", error);
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
          <MaterialCommunityIcons name="cart-outline" size={26} color={COLORS.yellow || '#F6AD55'} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.whiteSheetContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          
          <View style={styles.searchBarRow}>
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons name="magnify" size={22} color="#A0AEC0" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Buscar en la tienda..."
                placeholderTextColor="#A0AEC0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View style={styles.gridCategories}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity 
                  key={cat.id}
                  style={[
                    styles.categoryCard, 
                    { borderTopColor: cat.color },
                    isSelected && { backgroundColor: '#F7FAFC', borderWidth: 1.5, borderColor: cat.color }
                  ]}
                  onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                >
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                  <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.destacadosHeaderRow}>
            <Text style={styles.sectionTitle}>Destacados</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearFilterText}>Limpiar filtro</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.productRowCard}
                onPress={() => addToCart(item)} // ¡Ahora agrega al carrito reactivo al pulsar!
              >
                <View style={[styles.productImagePlaceholder, { backgroundColor: item.category === 'alimentos' ? '#FEFCBF' : '#E6FFFA' }]}>
                  <MaterialCommunityIcons 
                    name={item.category === 'alimentos' ? 'bone' : 'pill'} 
                    size={24} 
                    color={item.category === 'alimentos' ? '#B7791F' : '#319795'} 
                  />
                </View>
                
                <View style={styles.productInfoBlock}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productSubtext}>{item.subText || item.category}</Text>
                </View>

                <Text style={styles.productPrice}>
                  {typeof item.price === 'number' ? formatCurrency(item.price) : item.price}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="store-search" size={40} color="#CBD5E0" />
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
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 25 },
  headerSubtitle: { color: '#E2E8F0', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  headerTitle: { color: '#F6AD55', fontSize: 28, fontWeight: 'bold', marginTop: 2 },
  cartHeaderButton: { padding: 6, position: 'relative' },
  cartBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#E53E3E', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  whiteSheetContainer: { flex: 1, backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollPadding: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 },
  searchBarRow: { flexDirection: 'row', width: '100%', marginBottom: 20 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, height: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#2D3748' },
  gridCategories: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  categoryCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, marginBottom: 14, borderWidth: 1, borderColor: '#EDF2F7', borderTopWidth: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2 },
  categoryTitle: { fontSize: 15, fontWeight: 'bold', color: '#4A5568', textAlign: 'center' },
  categorySubtitle: { fontSize: 11, color: '#A0AEC0', textAlign: 'center', marginTop: 4 },
  destacadosHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 5 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#4A5568' },
  clearFilterText: { color: '#3182CE', fontSize: 12, fontWeight: '600' },
  productRowCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EDF2F7', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2 },
  productImagePlaceholder: { width: 60, height: 60, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  productInfoBlock: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  productSubtext: { fontSize: 12, color: '#A0AEC0', marginTop: 2 },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#4A5568', marginRight: 5 },
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#A0AEC0', fontSize: 13, marginTop: 8, textAlign: 'center' }
});