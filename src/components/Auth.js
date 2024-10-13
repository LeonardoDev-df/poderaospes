import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../data/firebaseConfig'; // Firebase authentication
import { Container, Form, Button, Tab, Tabs } from 'react-bootstrap';
import '../style/Auth.css'; // Importar o CSS para estilização
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const Auth = ({ onLogin }) => { // Receber a função onLogin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Alternar entre login e registro
  const navigate = useNavigate(); // Inicializar o useNavigate

  // Função de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Obter o usuário
      alert('Login realizado com sucesso!');
      onLogin(user); // Chama a função de callback com o usuário
      navigate('/cart'); // Redirecionar para a página do carrinho
    } catch (error) {
      setError('Erro ao fazer login: ' + error.message);
    }
  };

  // Função de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Obter o usuário
      alert('Usuário registrado com sucesso!');
      onLogin(user); // Chama a função de callback com o usuário
      navigate('/cart'); // Redirecionar para a página do carrinho
    } catch (error) {
      setError('Erro ao registrar: ' + error.message);
    }
  };

  return (
    <Container className="auth-container mt-5">
      <div className="auth-card">
        <h1 className="auth-title">Bem-vinda à Sua Loja de Calçados!</h1>
        <Tabs
          activeKey={isLogin ? 'login' : 'register'}
          onSelect={(k) => setIsLogin(k === 'login')}
          className="auth-tabs"
        >
          <Tab eventKey="login" title="Login">
            <Form onSubmit={handleLogin} className="auth-form">
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              <Button variant="primary" type="submit" className="auth-btn mt-3">
                Entrar
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="register" title="Registrar">
            <Form onSubmit={handleRegister} className="auth-form">
              <Form.Group controlId="formEmailRegister">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </Form.Group>
              <Form.Group controlId="formPasswordRegister">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirme sua senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="auth-input"
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              <Button variant="success" type="submit" className="auth-btn mt-3">
                Registrar
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default Auth;
