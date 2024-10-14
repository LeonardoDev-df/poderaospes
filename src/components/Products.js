import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../data/firebaseConfig'; // Importa a configuração do Firebase
import '../style/Products.css'; // Adicione um arquivo CSS para estilização

const Products = () => {
  const [products, setProducts] = useState([]);

  // Função para buscar produtos do Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products'); // Nome da coleção
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Produtos:", productList); // Log dos produtos para verificação
      setProducts(productList);
    } catch (error) {
      console.error("Erro ao buscar produtos: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Produtos</h1>
      <Row>
        {products.map((product) => (
          <Col md={4} key={product.id} className="mb-4">
            <Card className="product-card">
              <Card.Img variant="top" src={product.imageUrl} className="product-image" />
              <Card.Body>
                <Card.Title className="product-name">{product.name}</Card.Title>
                <Card.Text className="product-price">
                  Preço: R$ {product.price.toFixed(2)}
                </Card.Text>
                <button className="btn btn-primary add-to-cart">Adicionar ao Carrinho</button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products;
