import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../style/EditProductModal.css'; // Importa um CSS para personalizações adicionais

// Mapeamento de cores para seus valores hexadecimais
const colorMap = {
  'Bege': '#F5F5DC',
  'Prata': '#C0C0C0',
  'Preto': '#000000',
  'Rosa': '#FFC0CB',
  'Azul': '#0000FF',
  'Verde': '#008000',
};

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
    setProduct((prevProduct) => ({ ...prevProduct, [name]: updatedValues }));
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
                onChange={(e) => setProduct((prevProduct) => ({ ...prevProduct, name: e.target.value }))} // Atualiza o nome
                placeholder="Digite o nome do produto"
                className="rounded-pill"
                required
              />
            </Form.Group>

            {/* Cores Disponíveis */}
            <Form.Group className="mb-3" controlId="formProductColors">
              <Form.Label>Cores Disponíveis</Form.Label>
              <div className="checkbox-group">
                {Object.keys(colorMap).map((color) => (
                  <div key={color} className="form-check">
                    <input
                      type="checkbox"
                      id={color}
                      name="colors"
                      value={colorMap[color]} // Usa o valor hexadecimal correspondente
                      className="form-check-input"
                      checked={Array.isArray(product.colors) && product.colors.includes(colorMap[color])} // Verifica se a cor está selecionada
                      onChange={handleCheckboxChange} // Lógica para adicionar/remover a cor
                    />
                    <label htmlFor={color} className="form-check-label" style={{ color: colorMap[color] }}>
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </Form.Group>

            {/* Números Disponíveis */}
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
                onChange={(e) => setProduct((prevProduct) => ({ ...prevProduct, imageUrl: e.target.value }))} // Atualiza o URL da imagem
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
