import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Modal, Button, Form } from 'react-bootstrap';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../data/firebaseConfig'; // Importa a configuração do Firebase
import '../style/Products.css'; // Adicione um arquivo CSS para estilização

const Products = () => {
  const [products, setProducts] = useState([]);
  const [userEmail, setUserEmail] = useState(null); // Estado para armazenar o e-mail do usuário
  const [showEditModal, setShowEditModal] = useState(false); // Controle do modal de edição
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controle do modal de exclusão
  const [currentProduct, setCurrentProduct] = useState(null); // Produto atual a ser editado/excluído

  // Função para buscar produtos do Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products'); // Nome da coleção
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Erro ao buscar produtos: ", error);
    }
  };

  // Função para verificar o usuário autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Armazena o e-mail do usuário logado
      } else {
        setUserEmail(null); // Nenhum usuário logado
      }
    });
    return () => unsubscribe(); // Limpeza do listener ao desmontar o componente
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Função para abrir o modal de edição com o produto selecionado
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Função para salvar as alterações do produto
  const handleSaveEdit = async () => {
    try {
      const productRef = doc(db, 'products', currentProduct.id); // Referência ao documento no Firestore
      await updateDoc(productRef, {
        name: currentProduct.name,
        price: currentProduct.price,
        imageUrl: currentProduct.imageUrl
      });
      fetchProducts(); // Atualiza a lista de produtos
      setShowEditModal(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar o produto: ", error);
    }
  };

  // Função para abrir o modal de confirmação de exclusão
  const handleDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Função para excluir um produto
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'products', currentProduct.id)); // Remove o documento do Firestore
      fetchProducts(); // Atualiza a lista de produtos após a exclusão
      setShowDeleteModal(false); // Fecha o modal de confirmação
    } catch (error) {
      console.error("Erro ao excluir o produto: ", error);
    }
  };

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
                {userEmail === 'adm@adm.com' ? (
                  <>
                    <Button 
                      className="btn btn-warning mb-2" 
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </Button>
                    <Button 
                      className="btn btn-danger" 
                      onClick={() => handleDeleteModal(product)}
                    >
                      Excluir
                    </Button>
                  </>
                ) : (
                  <Button className="btn btn-primary add-to-cart">Adicionar ao Carrinho</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduct && (
            <Form>
              <Form.Group className="mb-3" controlId="formProductName">
                <Form.Label>Nome do Produto</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formProductPrice">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formProductImage">
                <Form.Label>URL da Imagem</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.imageUrl}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja excluir o produto "{currentProduct?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
