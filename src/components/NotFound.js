// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import '../style/NotFound.css'; // Adicione um arquivo CSS para estilização, se necessário

const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <h1>404 - Página Não Encontrada</h1>
      <p>Desculpe, mas a página que você está procurando não existe.</p>
      <Link to="/">
        <Button variant="primary">Voltar para a Página Inicial</Button>
      </Link>
    </Container>
  );
};

export default NotFound;
