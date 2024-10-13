import React from 'react';
import '../style/Home.css'; // Importa o arquivo CSS para estilização

const products = [
  {
    id: 1,
    name: 'Sandália Elegante',
    image: 'https://source.unsplash.com/200x200/?sandal',
    price: 'R$ 79,99',
    description: 'Uma sandália elegante para qualquer ocasião.',
  },
  {
    id: 2,
    name: 'Rasteirinha Colorida',
    image: 'https://source.unsplash.com/200x200/?flip-flop',
    price: 'R$ 49,99',
    description: 'Confortável e perfeita para o verão.',
  },
  {
    id: 3,
    name: 'Sandália Casual',
    image: 'https://source.unsplash.com/200x200/?shoes',
    price: '89,99',
    description: 'Perfeita para o dia a dia.',
  },
  {
    id: 4,
    name: 'Rasteirinha Básica',
    image: 'https://source.unsplash.com/200x200/?flip-flops',
    price: '39,99',
    description: 'Estilo e conforto para suas atividades diárias.',
  },
];

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Bem-vindo à loja Poder aos Pés</h1>
        <p className="hero-subtitle">Explore nossos produtos de calçados femininos!</p>
        <button className="hero-button">Ver Produtos</button>
      </div>
      <div className="featured-products">
        <h2 className="section-title">Produtos em Destaque</h2>
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img className="product-image" src={product.image} alt={product.name} />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
              <p className="product-description">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
