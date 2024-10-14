// src/components/Cart.js
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../style/Cart.css'; // Adicione um arquivo CSS para estilização, se necessário

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Produto 1',
      price: 29.99,
      quantity: 2,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Produto 2',
      price: 49.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  // Função para remover um item do carrinho
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };

  // Cálculo do total do carrinho
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container mt-5"> {/* Alterado para "cart-container" */}
      <h1 className="text-center mb-4">Carrinho</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Seu carrinho está vazio.</p>
      ) : (
        cartItems.map((item) => (
          <Card key={item.id} className="mb-3">
            <div className="d-flex align-items-center">
              <Card.Img variant="top" src={item.image} style={{ width: '150px', height: '150px' }} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Preço: R$ {item.price.toFixed(2)} <br />
                  Quantidade: {item.quantity}
                </Card.Text>
                <Button variant="danger" onClick={() => handleRemoveItem(item.id)}>
                  Remover do Carrinho
                </Button>
              </Card.Body>
            </div>
          </Card>
        ))
      )}
      <h3 className="text-end">Total: R$ {calculateTotal()}</h3>
    </div>
  );
};

export default Cart;
