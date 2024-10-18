import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Alert } from 'react-bootstrap';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../data/firebaseConfig';
import '../style/Products.css';
import Footer from './Footer';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';
import CartModal from './CartModal';

const Products = ({ updateCartCount }) => {
  const [products, setProducts] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Erro ao buscar produtos: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const productRef = doc(db, 'products', currentProduct.id);
      await updateDoc(productRef, {
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        stock: currentProduct.stock,
        imageUrl: currentProduct.imageUrl,
        colors: currentProduct.colors,
        sizes: currentProduct.sizes,
      });
      fetchProducts();
      setShowEditModal(false);
    } catch (error) {
      console.error("Erro ao atualizar o produto: ", error);
    }
  };

  const handleDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'products', currentProduct.id));
      fetchProducts();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erro ao excluir o produto: ", error);
    }
  };

  const handleAddToCart = (product) => {
    if (!userEmail) {
      setShowAlert(true);
      setTimeout(() => navigate('/auth'), 3000);
    } else {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
        setCurrentProduct(product);
        setShowCartModal(true);
      } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error);
      }
    }
  };

  return (
    <div className="product-container">
      <h1 className="text-center mb-4 title">Produtos</h1>

      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Por favor, faça login para adicionar itens ao carrinho. Redirecionando para a página de login...
        </Alert>
      )}

      <Row className="justify-content-center">
        {products.map((product) => (
          <Col md={4} key={product.id} className="mb-4">
            <Card className="product-card shadow-sm">
              <Card.Img variant="top" src={product.imageUrl} className="product-image" />
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
                {userEmail === 'adm@adm.com' ? (
                  <div className="button-container">
                    <Button className="btn btn-editar" onClick={() => handleEdit(product)}>
                      <i className="fas fa-edit"></i> {/* Ícone de edição */}
                      Editar
                    </Button>
                    <Button className="btn btn-danger" onClick={() => handleDeleteModal(product)}>
                      <i className="fas fa-trash"></i> {/* Ícone de exclusão */}
                      Excluir
                    </Button>
                  </div>
                ) : (
                  <Button className="btn btn-primary add-to-cart" onClick={() => handleAddToCart(product)}>
                    Adicionar ao Carrinho
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modals */}
      <EditProductModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        product={currentProduct}
        setProduct={setCurrentProduct}
        handleSave={handleSaveEdit}
      />
      <DeleteProductModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        product={currentProduct}
        handleDelete={handleDelete}
      />
      <CartModal
        show={showCartModal}
        handleClose={() => setShowCartModal(false)}
        product={currentProduct}
        handleProceed={() => navigate('/cart')}
      />
      
      <Footer />
    </div>
  );
};

export default Products;
