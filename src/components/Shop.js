// src/components/Shop.js
import React, { useState } from 'react';
import Products from './Products';
import Cart from './Cart';

const Shop = () => {
  const [cartItems, setCartItems] = useState([]);

  // Função para adicionar itens ao carrinho
  const addToCart = (product) => {
    const itemExists = cartItems.find(item => item.id === product.id);
    if (itemExists) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Função para remover item do carrinho
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };

  // Função para finalizar a compra
  const finalizePurchase = () => {
    alert(`Compra finalizada com ${cartItems.length} itens.`);
    setCartItems([]); // Limpa o carrinho
  };

  return (
    <div>
      <Products addToCart={addToCart} /> {/* Passa a função para adicionar itens */}
      <Cart 
        cartItems={cartItems} 
        removeFromCart={removeFromCart} 
        finalizePurchase={finalizePurchase} 
      />
    </div>
  );
};

export default Shop;
