import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importando para autenticação
import { db } from '../data/firebaseConfig'; // Sua configuração do Firebase
import { collection, addDoc } from 'firebase/firestore'; // Ajuste dependendo de qual banco você usa
import '../style/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Carregar itens do carrinho do localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verifica se storedCartItems é um array
    if (Array.isArray(storedCartItems)) {
      setCartItems(storedCartItems);
    } else {
      setCartItems([]); // Define como array vazio se não for um array
    }

    // Escutando alterações de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Limpa o carrinho ao deslogar
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    });

    return () => unsubscribe(); // Limpar o listener ao desmontar
  }, [auth]);

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const finalizePurchase = async () => {
    if (user) {
      try {
        // Salvar a compra no banco de dados
        await addDoc(collection(db, 'purchases'), {
          userId: user.uid,
          userName: user.displayName || 'Usuário Anônimo', // Pegar o nome do usuário
          items: cartItems,
          total: calculateTotal(),
          createdAt: new Date(),
        });
        alert(`Compra finalizada com sucesso! Total: R$ ${calculateTotal()}`);
        setCartItems([]); // Limpa o carrinho após a compra
        localStorage.removeItem('cart'); // Remove o carrinho do localStorage
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
                      Quantidade: {item.quantity}
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
    </div>
  );
};

export default Cart;
