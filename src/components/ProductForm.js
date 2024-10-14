// src/components/ProductForm.js
import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

const ProductForm = ({ product, onChange, onFileChange, onSubmit, message }) => {
  return (
    <form onSubmit={onSubmit} className="product-form container mt-4">
      {message && <p className="alert alert-info">{message}</p>}
      
      <div className="form-group">
        <label htmlFor="name">Nome do Produto:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          value={product.name}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Descrição:</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={product.description}
          onChange={onChange}
          required
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Preço:</label>
        <input
          type="number"
          id="price"
          name="price"
          className="form-control"
          value={product.price}
          onChange={onChange}
          required
          min="0"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Categoria:</label>
        <input
          type="text"
          id="category"
          name="category"
          className="form-control"
          value={product.category}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="image">Imagem:</label>
        <input
          type="file"
          id="image"
          className="form-control-file"
          onChange={onFileChange}
          accept="image/*"
        />
        {product.image && <p className="mt-2">Arquivo selecionado: {product.image.name}</p>} {/* Exibe o nome do arquivo */}
      </div>
      
      <button type="submit" className="btn btn-primary">Adicionar Produto</button>
    </form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.instanceOf(File),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default ProductForm;
