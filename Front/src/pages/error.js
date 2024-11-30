import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/error.css'; 

const Error = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/carrito');
    }, 8000); 
  }, [navigate]);

  return (
    <div className="Error-container">
      <h2>Pago Fallido</h2>
      <p>Serás redirigido al carrito en breve.</p>
      <div className="message">Redirigiendo...</div>
    </div>
  );
};

export default Error;
