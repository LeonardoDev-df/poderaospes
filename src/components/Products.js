// src/components/Products.js
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import '../style/Products.css'; // Adicione um arquivo CSS para estilização, se necessário

const Products = () => {
  const [products, setProducts] = useState([]);

  // Simulação de dados de produtos (você pode substituir isso pela chamada à API)
  const fetchProducts = async () => {
    // Exemplo de dados estáticos
    const sampleProducts = [
      {
        id: 1,
        name: 'Produto 1',
        price: 29.99,
        image: 'https://via.placeholder.com/150',
      },
      {
        id: 2,
        name: 'Produto 2',
        price: 49.99,
        image: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        name: 'Produto 3',
        price: 19.99,
        image: 'https://via.placeholder.com/150',
      },
      {
        id: 4,
        name: 'Produto 4',
        price: 99.99,
        image: 'https://via.placeholder.com/150',
      },
    ];
    setProducts(sampleProducts);
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
            <Card>
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  Preço: R$ {product.price.toFixed(2)}
                </Card.Text>
                <button className="btn btn-primary">Adicionar ao Carrinho</button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products;
