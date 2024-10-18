import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../style/EditProductModal.css'; // Importa um CSS para personalizações adicionais

const EditProductModal = ({ show, handleClose, product, setProduct, handleSave }) => {
  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    // Clona o array atual para não mutar o estado diretamente
    const updatedValues = Array.isArray(product[name]) ? [...product[name]] : [];

    if (checked) {
      // Se estiver checado, adiciona o valor ao array
      updatedValues.push(value);
    } else {
      // Se não estiver checado, remove o valor do array
      const index = updatedValues.indexOf(value);
      if (index > -1) {
        updatedValues.splice(index, 1);
      }
    }

    // Atualiza o produto com os novos valores
    setProduct({ ...product, [name]: updatedValues });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="text-center" style={{ color: '#007bff' }}>Editar Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {product && (
          <Form>
            <Form.Group className="mb-3" controlId="formProductName">
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Digite o nome do produto"
                className="rounded-pill"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProductDescription">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Digite a descrição do produto"
                className="rounded-pill"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProductPrice">
              <Form.Label>Preço (R$)</Form.Label>
              <Form.Control
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                placeholder="Digite o preço do produto"
                className="rounded-pill"
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProductStock">
              <Form.Label>Quantidade em Estoque</Form.Label>
              <Form.Control
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value, 10) })}
                placeholder="Digite a quantidade em estoque"
                className="rounded-pill"
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProductCategory">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="rounded-pill"
                required
              >
                <option value="">Selecione...</option>
                <option value="Sandálias">Sandálias</option>
                <option value="Rasteirinhas">Rasteirinhas</option>
                <option value="Sapatos de Salto">Sapatos de Salto</option>
                <option value="Sapatilhas">Sapatilhas</option>
                <option value="Botas">Botas</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProductColors">
              <Form.Label>Cores Disponíveis</Form.Label>
              {[
                { name: 'Bege', hex: '#D8C49B' },
                { name: 'Prata', hex: '#C0C0C0' },
                { name: 'Preto', hex: '#000000' },
                { name: 'Rosa', hex: '#FFC0CB' },
                { name: 'Azul', hex: '#0000FF' },
                { name: 'Verde', hex: '#008000' }
              ].map(({ name, hex }) => (
                <Form.Check
                  key={name}
                  type="checkbox"
                  id={name}
                  label={name}
                  value={name}
                  style={{ color: hex }} // Ajusta a cor do texto
                  checked={Array.isArray(product.colors) && product.colors.includes(name)}
                  onChange={handleCheckboxChange}
                  name="colors" // Nome do campo para cores
                />
              ))}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProductSizes">
              <Form.Label>Números Disponíveis</Form.Label>
              {['34', '35', '36', '37', '38', '39'].map((size) => (
                <Form.Check
                  key={size}
                  type="checkbox"
                  id={size}
                  label={size}
                  value={size}
                  checked={Array.isArray(product.sizes) && product.sizes.includes(size)}
                  onChange={handleCheckboxChange}
                  name="sizes" // Nome do campo para tamanhos
                />
              ))}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProductImage">
              <Form.Label>URL da Imagem</Form.Label>
              <Form.Control
                type="text"
                value={product.imageUrl}
                onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
                placeholder="Digite a URL da imagem"
                className="rounded-pill"
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="rounded-pill">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} className="rounded-pill" style={{ backgroundColor: '#007bff' }}>
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
