import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../style/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const finalizePurchase = () => {
    alert(`Compra finalizada com ${cartItems.length} itens.`);
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container mt-5">
    <h1 className="text-center mb-4">Carrinho</h1>
    {cartItems.length === 0 ? (
      <p className="text-center">Seu carrinho está vazio.</p>
    ) : (
      <>
        <div className='orh'>
          {cartItems.map((item) => (
            <Card key={item.id} className="cart-card mb-3">
              <div className="d-flex align-items-start"> {/* Alterado para align-items-start */}
                <Card.Img variant="top" src={item.imageUrl} className="cart-image" />
                <Card.Body className="cart-body">
                  <Card.Title className="cart-title">{item.name}</Card.Title>
                  <Card.Text className="cart-text">
                    Preço: R$ {item.price.toFixed(2)} <br />
                    Quantidade: {item.quantity}
                  </Card.Text>
                  <div className="mt-auto"> {/* Adicionado para empurrar o botão para baixo */}
                    <Button variant="danger" onClick={() => handleRemove(item.id)}>
                      Remover do Carrinho
                    </Button>
                  </div>
                </Card.Body>
              </div>
            </Card>
          ))}
        </div>
        
        <h3 className="text-end cart-total">Total: R$ {calculateTotal()}</h3>
        <Button className="btn btn-success" onClick={finalizePurchase}>
          Finalizar Compra
        </Button>
      </>
    )}
  </div>
  


  );
};

export default Cart;
