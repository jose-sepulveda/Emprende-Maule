import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateCliente } from '../services/crearCliente';
import { createVenta } from '../services/ventas';

const Exito = () => {
  const navigate = useNavigate();

  const handleContinuar = async () => {
    const idCliente = localStorage.getItem('id'); 
    console.log(idCliente)
    if (!idCliente) {
      console.error('ID de cliente no encontrado en localStorage');
      return; 
    }

    try {
      await createVenta(idCliente);
      await updateCliente(idCliente, { estado_de_venta: true }); //o de estado_pago?
      toast.success('Venta creada correctamente')
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
