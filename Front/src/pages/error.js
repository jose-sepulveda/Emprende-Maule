import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const navigate = useNavigate()
    const handleContinuar = async () => {
      navigate('/')
    }
    
  return (
    <div className="Error-container">
      <h2>Pago Fallido</h2>
      <p>Lo sentimos, no hemos podido procesar su pago en este momento.</p>
      <button onClick={handleContinuar}>Volver a Intentar</button>
    </div>
  );
};

export default Error;
