import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CartModal = ({ show, handleClose, product, handleProceed }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Produto Adicionado ao Carrinho</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      O produto "{product?.name}" foi adicionado ao seu carrinho. Deseja continuar comprando ou finalizar a compra?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Continuar Comprando
      </Button>
      <Button variant="primary" onClick={handleProceed}>
        Finalizar Compra
      </Button>
    </Modal.Footer>
  </Modal>
);

export default CartModal;
