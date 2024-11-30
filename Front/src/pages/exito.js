import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateCliente } from '../services/crearCliente';
import { createVenta } from '../services/ventas';

const Exito = () => {
  const navigate = useNavigate();
  const isExecuted = useRef(false); 

  useEffect(() => {
    const crearVentaAutomatica = async () => {
      if (isExecuted.current) return;
      isExecuted.current = true;


      const idCliente = localStorage.getItem('id'); 
      if (!idCliente) {
        console.error('ID de cliente no encontrado en localStorage');
        return; 
      }

      try {
        await createVenta(idCliente);
        await updateCliente(idCliente, { estado_de_venta: true }); 
        toast.success('Venta creada correctamente');
        navigate('/productoos'); 
      } catch (error) {
        console.error('Error al enviar datos de venta:', error);
        toast.error('Hubo un problema al procesar la venta');
      }
    };

    crearVentaAutomatica();
  }, [navigate]);

  return (
    <div className="exito-container">
      {/* <h2>Pago Exitoso</h2>
          <p>¡Su pago se ha procesado correctamente!</p>*/}
    </div>
  );
};

export default Exito;
