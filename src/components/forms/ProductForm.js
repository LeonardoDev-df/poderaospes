import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap
import '../../style/ProductForm.css'; // Importa o CSS customizado

const ProductForm = ({ product, onChange, onFileChange, message }) => {
  const colorMap = {
    'Bege': '#F5F5DC',
    'Prata': '#C0C0C0',
    'Preto': '#000000',
    'Rosa': '#FFC0CB',
    'Azul': '#0000FF',
    'Verde': '#008000',
  };

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
    onChange({ target: { name, value: updatedValues } });
  };

  return (
    <form className="product-form container mt-4 p-4 rounded shadow-sm">
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

      {/* Preço e Quantidade em Estoque alinhados horizontalmente */}
      <div className="form-row">
        <div className="form-group col-md-5">
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

        <div className="form-group col-md-5">
          <label htmlFor="stock">Quantidade em Estoque:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            className="form-control"
            value={product.stock}
            onChange={onChange}
            required
            min="0"
          />
        </div>
      </div>

      {/* Cores e Números Disponíveis alinhados horizontalmente */}
      <div className="form-row">
        <div className="form-group col-md-6">
          <label>Cores Disponíveis:</label>
          <div className="checkbox-group">
            {Object.keys(colorMap).map((color) => (
              <div key={color} className="form-check">
                <input
                  type="checkbox"
                  id={color}
                  name="colors" // Certifique-se de que o nome do campo seja 'colors'
                  value={colorMap[color]} // Usar o valor hexadecimal correspondente
                  className="form-check-input"
                  checked={Array.isArray(product.colors) && product.colors.includes(colorMap[color])} // Verifica se colors é um array
                  onChange={handleCheckboxChange} // Use a nova função de mudança
                />
                <label htmlFor={color} className="form-check-label">{color}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group col-md-6">
          <label>Números Disponíveis:</label>
          <div className="checkbox-group">
            {['34', '35', '36', '37', '38', '39'].map((size) => (
              <div key={size} className="form-check">
                <input
                  type="checkbox"
                  id={size}
                  name="sizes" // Certifique-se de que o nome do campo seja 'sizes'
                  value={size}
                  className="form-check-input"
                  checked={Array.isArray(product.sizes) && product.sizes.includes(size)} // Verifica se sizes é um array
                  onChange={handleCheckboxChange} // Use a nova função de mudança
                />
                <label htmlFor={size} className="form-check-label">{size}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campo Categoria com tamanho reduzido */}
      <div className="form-group col-md-4">
        <label htmlFor="category">Categoria:</label>
        <select
          id="category"
          name="category"
          className="form-control"
          value={product.category}
          onChange={onChange}
          required
        >
          <option value="">Selecione...</option>
          <option value="Sandálias">Sandálias</option>
          <option value="Rasteirinhas">Rasteirinhas</option>
          <option value="Sapatos de Salto">Sapatos de Salto</option>
          <option value="Sapatilhas">Sapatilhas</option>
          <option value="Botas">Botas</option>
        </select>
      </div>

      <br></br>

      <div className="form-group">
        <label htmlFor="image">Imagem:</label>
        <input
          type="file"
          id="image"
          className="form-control-file"
          onChange={onFileChange}
          accept="image/*"
        />
        {product.image && <p className="mt-2">Arquivo selecionado: {product.image.name}</p>}
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category: PropTypes.string.isRequired,
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string), // Aceita múltiplas cores em formato hexadecimal
    sizes: PropTypes.arrayOf(PropTypes.string),  // Aceita múltiplos números
    image: PropTypes.instanceOf(File),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default ProductForm;
