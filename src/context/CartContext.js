import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    // Inicializamos con los dos productos de ejemplo de tu mockup para pruebas visuales
    { id: 'f1', name: 'Concentrado a granel', price: 8500, quantity: 1, subText: 'Alimentos · por kg', category: 'alimentos' },
    { id: 'f2', name: 'Antipulgas pipeta', price: 25000, quantity: 1, subText: 'Antiparasitarios', category: 'antiparasitarios' }
  ]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Si el precio viene como string (ej: "$25.000"), lo limpiamos a número
      const numericPrice = typeof product.price === 'string' 
        ? parseInt(product.price.replace(/[^0-9]/g, ''), 10) 
        : product.price;

      return [...prevItems, { ...product, price: numericPrice, quantity: 1 }];
    });
  };

  // Modificar cantidad (sumar o restar)
  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0) // Si llega a 0, se elimina del carrito
    );
  };

  // Eliminar por completo un ítem
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  // Vaciar carrito
  const clearCart = () => setCartItems([]);

  // Cálculos globales
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);