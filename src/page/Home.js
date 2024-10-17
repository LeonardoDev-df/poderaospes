import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Funções para buscar os dados no Firestore
import { db } from '../data/firebaseConfig'; // Importa a configuração do Firebase
import { Card, Col, Row } from 'react-bootstrap'; // Componentes do react-bootstrap
import '../style/Home.css'; // Importa o arquivo CSS para estilização
import Footer from '../components/Footer'; // Importando o Footer

const Home = () => {
  const [products, setProducts] = useState([]); // Estado para armazenar os produtos
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento

  // useEffect para buscar os produtos do Firestore ao carregar o componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products'); // Nome da coleção no Firestore
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList); // Atualiza o estado com os produtos do Firestore
        setLoading(false); // Desativa o estado de carregamento
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false); // Mesmo em caso de erro, desativa o estado de carregamento
      }
    };

    fetchProducts(); // Chama a função de busca
  }, []); // O array vazio faz o useEffect rodar apenas uma vez após o componente ser montado

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Bem-vindo à loja Poder aos Pés</h1>
        <p className="hero-subtitle">Explore nossos produtos de calçados femininos!</p>
      </div>

      <div className="featured-products">
        <h2 className="section-title">Produtos em Destaque</h2>
        {loading ? (
          <p>Carregando produtos...</p> // Exibe uma mensagem de carregamento enquanto os produtos não são carregados
        ) : (
          <Row>
            {products.map((product) => (
              <Col md={4} key={product.id} className="mb-4">
                <Card className="product-card">
                  <Card.Img variant="top" src={product.imageUrl} className="product-image" alt={product.name} />
                  <Card.Body>
                    <Card.Title className="product-name">{product.name}</Card.Title>
                    <Card.Text className="product-price">
                      Preço: R$ {product.price.toFixed(2)}
                    </Card.Text>
                    <Card.Text className="product-description">
                      {product.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Footer /> {/* Adicionando o Footer aqui */}
    </div>
  );
};

export default Home;
