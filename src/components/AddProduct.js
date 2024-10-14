import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ProductForm from './ProductForm'; // Importa o formulário
import '../style/AddProduct.css'; // Estilo opcional
import { getAuth } from 'firebase/auth';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // Novo estado para progresso do upload
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
      image: e.target.files[0],
    }));
  };

  const uploadImage = async () => {
    if (!product.image) return ''; // Retorna uma string vazia se não houver imagem

    const imageRef = ref(storage, `products/${product.image.name}`);
    const uploadTask = uploadBytesResumable(imageRef, product.image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Atualiza o progresso do upload
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Erro no upload da imagem: ', error);
          reject(error);
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(imageUrl); // Resolve a promessa com a URL da imagem
        }
      );
    });
  };

  const auth = getAuth();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!auth.currentUser) {
    setMessage('Você precisa estar logado para adicionar um produto.');
    return;
  }

  try {
    let imageUrl = await uploadImage(); // Faz o upload da imagem e obtém a URL

    // Adiciona o produto ao Firestore
    const docRef = await addDoc(collection(db, 'products'), {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      category: product.category,
      imageUrl: imageUrl || '', // Se não houver URL, define como string vazia
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
      <h2 className="text-center">Cadastrar Produto</h2>
      {uploadProgress > 0 && <p>Progresso do upload: {uploadProgress.toFixed(2)}%</p>} {/* Exibe o progresso do upload */}
      <ProductForm
        product={product}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        message={message}
      />
    </div>
  );
};

export default AddProduct;
