import React, { useEffect, useState } from 'react'; // Importar useEffect e useState
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from 'react-router-dom'; // Renomeie o Routes importado
import Home from '../page/Home'; // Importar seu componente Home
import Products from '../components/Products'; // Importar seu componente de Produtos
import AddProduct from '../components/AddProduct'; // Importar seu componente de Adição de Produtos
import Cart from '../components/Cart'; // Importar seu componente de Carrinho
import Auth from '../components/Auth'; // Importar seu componente de Autenticação
import NotFound from '../components/NotFound'; // Importar seu componente para página não encontrada
import Navbar from '../components/Navbar'; // Importar seu componente Navbar
import About from '../components/About'; // Importar seu componente About
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importar funções do Firebase

const AppRoutes = () => { // Renomeie o componente aqui
  const [user, setUser] = useState(null); // Estado para armazenar o usuário

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Atualiza o estado do usuário ao alterar a autenticação
    });
    return () => unsubscribe(); // Limpa o listener quando o componente é desmontado
  }, []);

  // Função para lidar com login
  const handleLogin = (user) => {
    setUser(user); // Atualiza o estado com o usuário logado
  };

  return (
    <Router>
      <Navbar user={user} /> {/* Passar o usuário para o Navbar */}
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth onLogin={handleLogin} />} /> {/* Passar a função de login */}
        <Route path="/About" element={<About />} />
        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </Router>
  );
};

export default AppRoutes; // Renomeie a exportação
