import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Platform, Alert, Modal, Clipboard } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../config/colors';

export default function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartCount, clearCart } = useCart();
  
  // CONFIGURACIÓN DE CUENTAS (Cambia estos números por los reales del negocio)
  const NUMERO_NEQUI = "3123456789";
  const NUMERO_DAVIPLATA = "3219876543";

  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  
  const envio = subtotal > 0 ? 5000 : 0; 
  const total = subtotal + envio;

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0';
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Función para copiar el número al portapapeles del celular
  const copyToClipboard = (number, walletName) => {
    Clipboard.setString(number);
    // Un pequeño aviso flotante o alerta nativa para avisar que se copió
    Alert.alert('¡Copiado!', `El número de ${walletName} (${number}) se ha copiado al portapapeles.`);
  };

  const handleConfirmOrder = () => {
    const metodoTexto = paymentMethod === 'nequi' ? 'Nequi' : 'Daviplata';
    const numeroCuenta = paymentMethod === 'nequi' ? NUMERO_NEQUI : NUMERO_DAVIPLATA;
    
    Alert.alert(
      'Confirmar Pedido',
      `¿Deseas registrar tu pedido por ${formatCurrency(total)}?\n\nRecuerda que debes transferir a la cuenta ${metodoTexto}: ${numeroCuenta}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, registrar pedido', onPress: () => setSuccessModalVisible(true) }
      ]
    );
  };

  const handleCloseSuccess = () => {
    setSuccessModalVisible(false);
    clearCart();
    navigation.navigate('HomeTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.ciruela || '#5A344E'} barStyle="light-content" />

      {/* HEADER SUPERIOR */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Mi Carrito</Text>
          <Text style={styles.headerSubtitle}>{cartCount} artículo(s)</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTENEDOR BLANCO CURVADO */}
      <View style={styles.whiteSheetContainer}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cart-off" size={70} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.goBack()}>
              <Text style={styles.emptyButtonText}>Ir a la Tienda</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              
              {/* LISTA DE PRODUCTOS */}
              {cartItems.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={[styles.imagePlaceholder, { backgroundColor: item.category === 'alimentos' ? '#FEFCBF' : '#E6FFFA' }]}>
                    <MaterialCommunityIcons 
                      name={item.category === 'alimentos' ? 'bone' : 'pill'} 
                      size={24} 
                      color={item.category === 'alimentos' ? '#B7791F' : '#319795'} 
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemSubtext}>{item.subText || item.category}</Text>
                    <Text style={styles.itemPriceUnit}>{formatCurrency(item.price)}</Text>
                  </View>
                  <View style={styles.actionsBlock}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(item.id)}>
                      <MaterialCommunityIcons name="delete-outline" size={18} color="#E53E3E" />
                    </TouchableOpacity>
                    <View style={styles.quantitySelector}>
                      <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, -1)}>
                        <MaterialCommunityIcons name="minus" size={14} color="#4A5568" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, 1)}>
                        <MaterialCommunityIcons name="plus" size={14} color="#4A5568" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              {/* SECCIÓN MÉTODOS DE PAGO CON NÚMEROS */}
              <Text style={styles.sectionTitle}>Cuentas de Consignación</Text>
              <View style={styles.paymentMethodsContainer}>
                
                {/* Tarjeta Nequi */}
                <TouchableOpacity 
                  style={[styles.paymentCard, paymentMethod === 'nequi' && styles.paymentCardSelected]} 
                  onPress={() => setPaymentMethod('nequi')}
                >
                  <View style={styles.paymentRadioRow}>
                    <View style={[styles.radioCircle, paymentMethod === 'nequi' && styles.radioCircleChecked]}>
                      {paymentMethod === 'nequi' && <View style={styles.radioInnerCircle} />}
                    </View>
                    <MaterialCommunityIcons name="cellphone-arrow-down" size={20} color="#A1006B" style={{ marginLeft: 8 }} />
                    <Text style={styles.paymentLabel}>Nequi</Text>
                  </View>
                  
                  {/* Bloque con el Número de Cuenta */}
                  <View style={styles.accountNumberBox}>
                    <Text style={styles.accountNumberText}>Cel: <Text style={{ fontWeight: 'bold' }}>{NUMERO_NEQUI}</Text></Text>
                    <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(NUMERO_NEQUI, 'Nequi')}>
                      <MaterialCommunityIcons name="content-copy" size={14} color="#5A344E" />
                      <Text style={styles.copyButtonText}>Copiar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Tarjeta Daviplata */}
                <TouchableOpacity 
                  style={[styles.paymentCard, paymentMethod === 'daviplata' && styles.paymentCardSelected]} 
                  onPress={() => setPaymentMethod('daviplata')}
                >
                  <View style={styles.paymentRadioRow}>
                    <View style={[styles.radioCircle, paymentMethod === 'daviplata' && styles.radioCircleChecked]}>
                      {paymentMethod === 'daviplata' && <View style={styles.radioInnerCircle} />}
                    </View>
                    <MaterialCommunityIcons name="wallet-outline" size={20} color="#E53E3E" style={{ marginLeft: 8 }} />
                    <Text style={styles.paymentLabel}>Daviplata</Text>
                  </View>
                  
                  {/* Bloque con el Número de Cuenta */}
                  <View style={styles.accountNumberBox}>
                    <Text style={styles.accountNumberText}>Cel: <Text style={{ fontWeight: 'bold' }}>{NUMERO_DAVIPLATA}</Text></Text>
                    <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(NUMERO_DAVIPLATA, 'Daviplata')}>
                      <MaterialCommunityIcons name="content-copy" size={14} color="#5A344E" />
                      <Text style={styles.copyButtonText}>Copiar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

              </View>

              {/* RESUMEN DE COSTOS */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumen de la orden</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Costo de envío</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(envio)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total a pagar</Text>
                  <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                </View>
              </View>

            </ScrollView>

            {/* BOTÓN FIJO INFERIOR */}
            <View style={styles.footerCheckout}>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleConfirmOrder}>
                <Text style={styles.checkoutButtonText}>Confirmar Pedido</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* MODAL DE ÉXITO DINÁMICO */}
      <Modal animationType="fade" transparent={true} visible={successModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <MaterialCommunityIcons name="check-bold" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>¡Pedido Registrado!</Text>
            
            <Text style={styles.modalMessage}>
              Tu solicitud por un valor de <Text style={{fontWeight: 'bold', color: '#2D3748'}}>{formatCurrency(total)}</Text> ha sido procesada.{'\n\n'}
              Por favor realiza la transferencia desde tu aplicación de <Text style={{fontWeight: 'bold', color: '#5A344E'}}>{paymentMethod === 'nequi' ? 'Nequi' : 'Daviplata'}</Text> al número:{'\n'}
              <Text style={styles.modalAccountNumberHighlight}>
                {paymentMethod === 'nequi' ? NUMERO_NEQUI : NUMERO_DAVIPLATA}
              </Text>
              {'\n\n'}Luego, envía el comprobante de pago a la línea de atención para coordinar el despacho.
            </Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleCloseSuccess}>
              <Text style={styles.modalButtonText}>Entendido, ir al Inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#5A344E' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 30 : 55, paddingBottom: 25 },
  backButton: { padding: 8 },
  headerTitleBlock: { alignItems: 'center', flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#E2E8F0', fontSize: 12, marginTop: 2 },
  whiteSheetContainer: { flex: 1, backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollPadding: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#EDF2F7', elevation: 1 },
  imagePlaceholder: { width: 55, height: 55, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  itemSubtext: { fontSize: 11, color: '#A0AEC0', marginTop: 1, textTransform: 'capitalize' },
  itemPriceUnit: { fontSize: 13, fontWeight: '600', color: '#4A5568', marginTop: 4 },
  
  actionsBlock: { alignItems: 'flex-end', justifyContent: 'space-between', height: 65 },
  deleteButton: { padding: 2 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', padding: 2 },
  qtyButton: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 13, fontWeight: 'bold', color: '#2D3748', paddingHorizontal: 8 },

  /* MÉTODOS DE PAGO CON CONTENEDOR DE NÚMERO */
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#4A5568', marginTop: 12, marginBottom: 12 },
  paymentMethodsContainer: { marginBottom: 20, gap: 12 },
  paymentCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#EDF2F7', elevation: 1 },
  paymentCardSelected: { borderColor: '#5A344E', backgroundColor: '#FDF8FB', borderWidth: 1.5 },
  paymentRadioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E0', justifyContent: 'center', alignItems: 'center' },
  radioCircleChecked: { borderColor: '#5A344E' },
  radioInnerCircle: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#5A344E' },
  paymentLabel: { fontSize: 14, fontWeight: 'bold', color: '#2D3748', marginLeft: 10 },
  
  accountNumberBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F7FAFC', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, marginLeft: 26, marginTop: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  accountNumberText: { fontSize: 14, color: '#4A5568' },
  copyButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  copyButtonText: { fontSize: 11, fontWeight: 'bold', color: '#5A344E' },
  
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginTop: 5, borderWidth: 1, borderColor: '#EDF2F7' },
  summaryTitle: { fontSize: 15, fontWeight: 'bold', color: '#2D3748', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#718096' },
  summaryValue: { fontSize: 13, fontWeight: '600', color: '#2D3748' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#EDF2F7', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#2D3748' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#5A344E' },
  
  footerCheckout: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#EDF2F7' },
  checkoutButton: { backgroundColor: '#5A344E', borderRadius: 16, height: 52, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginBottom: 50 },
  checkoutButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A5568', marginBottom: 20 },
  emptyButton: { backgroundColor: '#5A344E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  emptyButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, width: '100%', padding: 24, alignItems: 'center', elevation: 5 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#48BB78', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3748', marginBottom: 8 },
  modalMessage: { fontSize: 14, color: '#718096', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalAccountNumberHighlight: { fontSize: 22, fontWeight: 'bold', color: '#5A344E', letterSpacing: 1, backgroundColor: '#FDF8FB', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#5A344E', marginTop: 10, overflow: 'hidden', textAlign: 'center' },
  modalButton: { backgroundColor: '#5A344E', width: '100%', height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  modalButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }
});