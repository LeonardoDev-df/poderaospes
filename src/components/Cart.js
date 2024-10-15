import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../style/Cart.css';

const Cart = ({ removeFromCart, finalizePurchase }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id); // Chama a função passada como prop para remover o item
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems); // Atualiza o estado local
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
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-3">
              <div className="d-flex align-items-center">
                <Card.Img variant="top" src={item.image} style={{ width: '150px', height: '150px' }} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    Preço: R$ {item.price.toFixed(2)} <br />
                    Quantidade: {item.quantity}
                  </Card.Text>
                  <Button variant="danger" onClick={() => handleRemove(item.id)}>
                    Remover do Carrinho
                  </Button>
                </Card.Body>
              </div>
            </Card>
          ))}
          <h3 className="text-end">Total: R$ {calculateTotal()}</h3>
          <Button className="btn btn-success" onClick={finalizePurchase}>
            Finalizar Compra
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;
