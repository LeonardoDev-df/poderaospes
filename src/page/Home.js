import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../data/firebaseConfig';
import { Card, Col, Row } from 'react-bootstrap';
import '../style/Home.css';
import Footer from '../components/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Bem-vindo à loja Poder aos Pés</h1>
        <p className="hero-subtitle">Explore nossos produtos de calçados femininos!</p>
      </div>

      <div className="featured-products">
        <h2 className="section-title">Produtos em Destaque</h2>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <Row className="product-list">
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
                    <Card.Text className="product-stock">
                      Estoque: {product.stock} unidades disponíveis
                    </Card.Text>
                    <Card.Text className="product-colors">
                      <span>Cores disponíveis:</span>
                      <div className="color-bullets">
                        {product.colors.map((color, index) => (
                          <span
                            key={index}
                            className="color-bullet"
                            style={{ backgroundColor: color }} // Usando a cor do produto como fundo
                          ></span>
                        ))}
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
