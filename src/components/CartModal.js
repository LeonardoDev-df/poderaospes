import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../style/CartModal.css';

// Estilos adicionais
const modalStyles = {
  color: '#333333',
  fontFamily: 'Open Sans, sans-serif',
};

const titleStyles = {
  fontFamily: 'Playfair Display, serif',
  color: '#FAB1B1',
};

const infoTextStyles = {
  fontFamily: 'Open Sans, sans-serif',
  color: '#FAB1B1',
};

// Mapeamento de cores em hexadecimal para nomes
const colorNames = {
  '#C0C0C0': 'Prata',
  '#F5F5DC': 'Bege',
  '#FF0000': 'Vermelho',
  '#008000': 'Verde',
  '#0000FF': 'Azul',
  '#FFFFFF': 'Branco',
  '#000000': 'Preto',
  '#FFC0CB': 'Rosa',
  // Adicione mais cores conforme necessário
};

const CartModal = ({ show, handleClose, product, handleProceed }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Definir o primeiro tamanho disponível como o padrão
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]); // Define o primeiro tamanho como selecionado por padrão
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Por favor, selecione uma cor e um tamanho.');
      return;
    }

    handleProceed({
      product: product,
      options: {
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      },
    });
  };

  const getColorName = (color) => colorNames[color] || 'Cor desconhecida';

  const getColorPreview = (color) => {
    if (color) {
      return (
        <div
          style={{
            backgroundColor: color,
            width: '30px',
            height: '30px',
            display: 'inline-block',
            marginLeft: '10px',
            border: '1px solid #ccc',
            borderRadius: '50%',
          }}
        />
      );
    }
    return null;
  };

  if (!product) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} style={modalStyles}>
      <Modal.Header closeButton>
        <Modal.Title style={titleStyles}>Selecione Cor e Tamanho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <div className='sas'>
            <Form.Label>Escolha a cor:</Form.Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Form.Control
              as="select"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{ maxWidth: '200px', fontFamily: 'Montserrat, sans-serif' }}
            >
              <option value="">Selecione uma cor</option>
              {product.colors && product.colors.map((color, index) => (
                <option key={index} value={color}>
                  {getColorName(color)}
                </option>
              ))}
            </Form.Control>
            {getColorPreview(selectedColor)}
          </div>
        </Form.Group>

        <Form.Group>
          <div className='sas'>
            <Form.Label>Tamanhos Disponíveis</Form.Label>
          </div>
          <div className='ass'>
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  label={size}
                  name="size"
                  value={size}
                  checked={selectedSize === size}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={{ color: '#F08080' }}
                />
              ))
            ) : (
              <p>Nenhum tamanho disponível.</p>
            )}
          </div>
        </Form.Group>

        <div className='sis'>
          <Form.Group>
            <div className='sas'>
              <Form.Label>Quantidade</Form.Label>
            </div>
            <div className='sist'>
              <Form.Control
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              />
            </div>
          </Form.Group>
        </div>

        <p style={infoTextStyles}>
          O produto "{product?.name}" será adicionado ao seu carrinho com a cor "{getColorName(selectedColor)}" e tamanho "{selectedSize}". Deseja continuar comprando ou finalizar a compra?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAddToCart}>
          Adicionar ao Carrinho
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
