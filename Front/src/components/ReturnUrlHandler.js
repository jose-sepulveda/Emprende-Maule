import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmWebpayTransaction } from '../services/ventas';  
import { toast } from 'react-toastify';

const ReturnUrlHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCommitTransaction = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token_ws = urlParams.get('token_ws');

        if (!token_ws) {
          throw new Error('No se encontró token_ws en la URL');
        }

        localStorage.setItem('token_ws', token_ws);

        const response = await confirmWebpayTransaction(token_ws);

        if (response.details.status === 'AUTHORIZED') {
          const idCliente = localStorage.getItem('id'); 
          if (idCliente) {
            await updateCliente(idCliente, { estado_pago: true });  
          }

          navigate('/exito');
        } else {
          const idCliente = localStorage.getItem('id'); 
          if (idCliente) {
            await updateCliente(idCliente, { estado_pago: false });  
          }
          navigate('/error');
        }
      } catch (error) {
        console.error('Error al confirmar la transacción', error);
        toast.error('Error al procesar la transacción. Intente nuevamente.');
        navigate('/error');
      }
    };

    handleCommitTransaction();
  }, [location, navigate]);

  return (
    <div>
      <h2>Procesando...</h2>
      <p>Espere un momento mientras se procesa su pago.</p>
    </div>
  );
};

export default ReturnUrlHandler;
