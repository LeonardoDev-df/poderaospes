import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../data/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import CartModal from './CartModal';
import '../style/Cart.css';

// Mapeamento de cores em hexadecimal para nomes
const colorNames = {
  '#C0C0C0': 'Prata',
  '#F5F5DC': 'Bege',
  '#FF0000': 'Vermelho',
  '#008000': 'Verde',
  '#0000FF': 'Azul',
  '#FFFFFF': 'Branco',
  '#000000': 'Preto',
  // Adicione mais cores conforme necessário
};

const getColorName = (color) => colorNames[color] || 'Cor desconhecida';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(Array.isArray(storedCartItems) ? storedCartItems : []);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAddProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleProceed = (productWithDetails) => {
    const updatedCart = [...cartItems, {
      ...productWithDetails.product,
      color: productWithDetails.options.color,
      size: productWithDetails.options.size,
      quantity: productWithDetails.options.quantity, // Agora pega a quantidade do modal
    }];
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setShowModal(false);
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const finalizePurchase = async () => {
    if (user) {
      try {
        await addDoc(collection(db, 'purchases'), {
          userId: user.uid,
          userName: user.displayName || 'Usuário Anônimo',
          items: cartItems,
          total: calculateTotal(),
          createdAt: new Date(),
        });
        alert(`Compra finalizada com sucesso! Total: R$ ${calculateTotal()}`);
        setCartItems([]);
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
        alert('Erro ao finalizar a compra. Tente novamente.');
      }
    } else {
      alert('Você precisa estar logado para finalizar a compra.');
    }
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
          <div className="orh">
            {cartItems.map((item) => (
              <Card key={item.id} className="cart-card mb-3">
                <div className="d-flex">
                  <Card.Img variant="top" src={item.imageUrl} className="cart-image" />
                  <Card.Body className="cart-body">
                    <Card.Title className="cart-title">{item.name}</Card.Title>
                    <Card.Text className="cart-text">
                      Preço: R$ {item.price.toFixed(2)} <br />
                      Quantidade: {item.quantity} <br />
                      Cor: {getColorName(item.color) || 'N/A'} <br /> {/* Usando getColorName aqui */}
                      Tamanho: {item.size || 'N/A'}
                    </Card.Text>
                    <Button variant="danger" onClick={() => handleRemove(item.id)}>
                      Remover do Carrinho
                    </Button>
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
      {selectedProduct && (
        <CartModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
          handleProceed={handleProceed}
        />
      )}
    </div>
  );
};

export default Cart;
