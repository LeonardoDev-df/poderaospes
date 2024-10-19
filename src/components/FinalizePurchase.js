import React from 'react';
import { Button } from 'react-bootstrap';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../data/firebaseConfig';
import emailjs from 'emailjs-com';

const FinalizePurchase = ({ user, cartItems, calculateTotal, setCartItems }) => {
  const finalizePurchase = async () => {
    if (user) {
      try {
        // Prepara o objeto de endereço do usuário com todos os campos disponíveis
        const userAddress = `${user.address || 'Endereço não fornecido'}, CEP: ${user.cep || 'CEP não fornecido'}`;
        const userCpf = user.cpf || 'CPF não fornecido';

        // Adiciona a compra ao Firestore
        await addDoc(collection(db, 'purchases'), {
          userId: user.uid,
          userName: user.name || 'Usuário Anônimo',
          items: cartItems,
          total: calculateTotal(),
          address: userAddress,
          cpf: userCpf,
          createdAt: new Date(),
        });

        // Envia e-mail de confirmação ao dono do site
        sendEmailToOwner({
          userName: user.name || 'Usuário Anônimo',
          userEmail: user.email,
          items: cartItems,
          total: calculateTotal(),
          address: userAddress,
          cpf: userCpf,
          purchaseDate: new Date().toLocaleString(),
        });

        alert(`Compra finalizada com sucesso! Total: R$ ${calculateTotal()}`);
        setCartItems([]); // Limpa o carrinho
        localStorage.removeItem('cart'); // Remove os itens do localStorage
      } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
        alert('Erro ao finalizar a compra. Tente novamente.');
      }
    } else {
      alert('Você precisa estar logado para finalizar a compra.');
    }
  };

  const sendEmailToOwner = (purchaseDetails) => {
    const emailParams = {
      to_name: 'Dono do Site',
      from_name: purchaseDetails.userName,
      user_email: purchaseDetails.userEmail,
      items: purchaseDetails.items.map(item => 
        `${item.name} (Cor: ${item.color || 'não especificada'}, Tamanho: ${item.size || 'não especificado'}, Quantidade: ${item.quantity})`
      ).join(',\n'),
      total: purchaseDetails.total,
      address: purchaseDetails.address,
      cpf: purchaseDetails.cpf,
      purchase_date: purchaseDetails.purchaseDate,
    };

    emailjs.send('service_2wpe0mc', 'template_f119epf', emailParams, 'GtUS43FyT4rOjy9Np')
      .then((response) => {
        // Se o e-mail for enviado com sucesso, o código entrará aqui
        console.log('E-mail enviado com sucesso!', response.status, response.text);
        alert('O e-mail foi enviado com sucesso!'); // Exibe uma mensagem para o usuário
      })
      .catch((error) => {
        // Se ocorrer algum erro, o código entrará aqui
        console.error('Erro ao enviar o e-mail:', error);
        alert('Erro ao enviar o e-mail. Por favor, tente novamente.'); // Exibe uma mensagem de erro para o usuário
      });
  };
  
  return (
    <Button className="botao-purchase" onClick={finalizePurchase} style={{ display: 'flex' }}>
      Finalizar Compra
    </Button>
  );
};

export default FinalizePurchase;
