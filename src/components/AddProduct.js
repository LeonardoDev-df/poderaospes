// src/components/AddProduct.js
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import '../style/AddProduct.css'; // Estilo opcional

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null, // Para armazenar a imagem selecionada
  });

  const [message, setMessage] = useState('');
  const db = getFirestore();
  const storage = getStorage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      image: e.target.files[0], // Armazena a imagem
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Primeiro, faça o upload da imagem para o Firebase Storage
      if (product.image) {
        const imageRef = ref(storage, `products/${product.image.name}`);
        await uploadBytes(imageRef, product.image);
      }

      // Depois, adicione os detalhes do produto ao Firestore
      const docRef = await addDoc(collection(db, 'products'), {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        imageUrl: product.image ? `products/${product.image.name}` : '', // URL da imagem, se necessário
      });

      setMessage('Produto adicionado com sucesso!');
      setProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });
    } catch (error) {
      console.error('Erro ao adicionar produto: ', error);
      setMessage('Erro ao adicionar produto. Tente novamente.');
    }
  };

  return (
    <div className="add-product-container">
      <h2>Cadastrar Produto</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome do Produto:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Preço:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
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
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Imagem:</label>
          <input
            type="file"
            id="image"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>
        <button type="submit">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default AddProduct;
