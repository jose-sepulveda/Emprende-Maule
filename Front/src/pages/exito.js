import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateCliente } from '../services/crearCliente'; 
import { createVenta } from '../services/ventas';

const Exito = () => {
  const navigate = useNavigate();

  const handleContinuar = async () => {
    const idCliente = localStorage.getItem('id'); 
    if (!idCliente) {
      console.error('ID de cliente no encontrado en localStorage');
      return; 
    }

    try {
      await createVenta(idCliente);
      await updateCliente(idCliente, { estado_de_venta: true }); //o de estado_pago?
      navigate('/'); 
    } catch (error) {
      console.error('Error al enviar datos de venta:', error);
    }
  };

  return (
    <div className="exito-container">
      <h2>Pago Exitoso</h2>
      <p>¡Su pago se ha procesado correctamente!</p>
      <button onClick={handleContinuar}>Continuar</button>
    </div>
  );
};

export default Exito;
