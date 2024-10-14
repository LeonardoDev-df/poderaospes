import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { getAuth, signOut } from 'firebase/auth';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../style/Navbar.css'; // Certifique-se de que o caminho do arquivo CSS está correto
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS

const Navbar = ({ user }) => {
  const cartItems = 2; // Exemplo com 2 itens no carrinho
  const auth = getAuth();
  const navigate = useNavigate(); // Inicializar o useNavigate

  // Função de logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('Usuário deslogado com sucesso');
        navigate('/'); // Redirecionar para a Home após o logout
      })
      .catch((error) => {
        console.error('Erro ao fazer logout', error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container custom-navbar-container">
        <Link className="navbar-brand custom-brand" to="/">
          Poder aos Pés
        </Link>
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto"></ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link custom-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-link" to="/products">
                Produtos
              </Link>
            </li>

            {/* Link Sobre Nós adicionado */}
            <li className="nav-item">
              <Link className="nav-link custom-link" to="/about">
                Sobre Nós
              </Link>
            </li>

            {/* Verifica o email do usuário para exibir o link correto */}
            {user && user.email === 'adm@adm.com' ? (
              <li className="nav-item">
                <Link className="nav-link custom-link" to="/add-product">
                  Cadastrar Produtos
                </Link>
              </li>
            ) : (
              user && (
                <li className="nav-item">
                  <Link className="nav-link position-relative custom-cart-link" to="/cart">
                    <FaShoppingCart size={20} />
                    {cartItems > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill custom-cart-badge">
                        {cartItems}
                      </span>
                    )}
                  </Link>
                </li>
              )
            )}

            {user ? (
              <>
                <li className="nav-item">
                  {/* Exibe o nome do usuário, se estiver definido */}
                  <span className="nav-link custom-link">
                    {user.displayName ? `Olá, ${user.displayName}` : 'Olá, Usuário'}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn custom-btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn custom-btn-login" to="/auth">
                  <FaUser className="me-1" /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
