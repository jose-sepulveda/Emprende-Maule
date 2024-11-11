import React, { useEffect, useState } from 'react';
import { deleteCliente, getClientes } from '../services/crearCliente';

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
        //alert('Error al eliminar cliente');
      }
    }
  };

  return (
    <div className="container">
      <h1>Gestión de Clientes</h1>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.nombre_cliente} {cliente.apellido1_cliente} {cliente.apellido2_cliente}</td>
              <td>{cliente.correo}</td>
              <td>
                <button id="eliminar" className="btn-eliminar" onClick={() => eliminarCliente(cliente.id_cliente)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { GestionClientes };

