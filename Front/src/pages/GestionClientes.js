import React, { useEffect, useState } from 'react';
import { deleteCliente, getClientes } from '../services/crearCliente';
import '../Styles/gestionClientes.css';

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await getClientes();
      const sortedClientes = response.data.sort((a, b) => a.id_cliente - b.id_cliente);
      setClientes(sortedClientes);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const eliminarCliente = async (id_cliente) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
    if (confirmDelete) {
      try {
        await deleteCliente(id_cliente);
        cargarClientes(); 
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  return (
    <div className="gestion-clientes-container">
      <h1>Gestión de Clientes</h1>

      <table className='gestion-clientes-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>
              <td>{cliente.nombre_cliente} {cliente.apellido1_cliente} {cliente.apellido2_cliente}</td>
              <td>{cliente.correo}</td>
              <td>
                <button className="gestion-clientes-btn-eliminar" onClick={() => eliminarCliente(cliente.id_cliente)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { GestionClientes };

