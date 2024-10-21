import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ProductForm from '../components/forms/ProductForm'; // Importa o formulário
import '../style/AddProduct.css'; // Estilo opcional 
import { getAuth } from 'firebase/auth';

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

const AddProduct = () => {
  const [products, setProducts] = useState([{
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '', // Adicionando o estoque
    colors: [], // Adicionando cores
    sizes: [],  // Adicionando tamanhos
    image: null,
  }]);

  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // Novo estado para progresso do upload
  const db = getFirestore();
  const storage = getStorage();

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = { ...updatedProducts[index], [name]: value };
      return updatedProducts;
    });
  };

  const handleColorChange = (index, selectedColors) => {
    setProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = { ...updatedProducts[index], colors: selectedColors };
      return updatedProducts;
    });
  };

  const handleFileChange = (index, e) => {
    setProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = { ...updatedProducts[index], image: e.target.files[0] };
      return updatedProducts;
    });
  };

  const uploadImage = async (image) => {
    if (!image) return ''; // Retorna uma string vazia se não houver imagem

    const imageRef = ref(storage, `products/${image.name}`);
    const uploadTask = uploadBytesResumable(imageRef, image);

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
      const addedProductIds = [];

      for (const product of products) {
        let imageUrl = await uploadImage(product.image); // Faz o upload da imagem e obtém a URL

        // Adiciona o produto ao Firestore
        const docRef = await addDoc(collection(db, 'products'), {
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          category: product.category,
          stock: parseInt(product.stock, 10), // Adiciona o estoque como inteiro
          colors: product.colors || [], // Adiciona cores
          sizes: product.sizes || [], // Adiciona tamanhos
          imageUrl: imageUrl || '', // Se não houver URL, define como string vazia
        });

        addedProductIds.push(docRef.id);
      }

      setMessage(`Produtos adicionados com sucesso! IDs: ${addedProductIds.join(', ')}`);
      setProducts([{
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '', // Reseta o estoque
        colors: [], // Reseta as cores
        sizes: [],  // Reseta os tamanhos
        image: null,
      }]); // Reseta o formulário para o primeiro produto
    } catch (error) {
      console.error('Erro ao adicionar produto: ', error);
      setMessage('Erro ao adicionar produtos. Tente novamente.');
    }
  };

  const addProductField = () => {
    setProducts([...products, {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '', // Adicionando o estoque
      colors: [], // Adicionando cores
      sizes: [],  // Adicionando tamanhos
      image: null,
    }]);
  };

  return (
    <div className="add-product-container">
      <h2 className="text-center">Cadastrar Produto</h2>
      {uploadProgress > 0 && <p>Progresso do upload: {uploadProgress.toFixed(2)}%</p>}
      
      <div className="row-add">
        {products.map((product, index) => (
          <div key={index} className="col-12 col-md-12 "> {/* Responsivo com colunas */}
            <ProductForm
              product={product}
              onChange={(e) => handleChange(index, e)}
              onFileChange={(e) => handleFileChange(index, e)}
              onColorChange={(selectedColors) => handleColorChange(index, selectedColors)}
              message={message}
              colorNames={colorNames}
            />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button className="custom-btn" onClick={addProductField}>
           Outro Produto
        </button>
        <button type="submit" className="custom-btn" onClick={handleSubmit}>
          Adicionar Produtos
        </button>
      </div>

    </div>
  );
};

export default AddProduct;
