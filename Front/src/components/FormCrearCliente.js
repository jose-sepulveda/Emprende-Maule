import React, { useState } from 'react';
import { createCliente } from '../services/crearCliente';
import '../Styles/formCliente.css';


const FormCrearCliente = () => {
  const [formData, setFormData] = useState({
    rut_cliente: '',
    contrasena: '',
    nombre_cliente: '',
    apellido1_cliente: '',
    apellido2_cliente: '',
    direccion: '',
    telefono: '',
    correo: ''
  });

  const [mensaje, setMensaje] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCliente(formData);
      setMensaje('Cliente creado exitosamente');
      setFormData({
        rut_cliente: '',
        contrasena: '',
        nombre_cliente: '',
        apellido1_cliente: '',
        apellido2_cliente: '',
        direccion: '',
        telefono: '',
        correo: ''
      });
    } catch (error) {
      setMensaje('Error al crear el cliente');
      console.error(error);
    }
  };

  return (
    <div className='containerFormCrearCliente'>
      <h2>Crear Cuenta Cliente</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div className="containerInput">
            <div>
                <label>Nombre</label>
                <input type="text" name="nombre_cliente" value={formData.nombre_cliente} onChange={handleInputChange} required />
            </div>
        <div>
            <label>Apellido Paterno</label>
            <input type="text" name="apellido1_cliente" value={formData.apellido1_cliente} onChange={handleInputChange} required />
        </div>
        </div>

        <div className="containerInput">
            <div>
                <label>Apellido Materno</label>
                <input type="text" name="apellido2_cliente" value={formData.apellido2_cliente} onChange={handleInputChange} required/>
            </div>
            <div>
                <label>RUT</label>
                <input type="text" name="rut_cliente" value={formData.rut_cliente} onChange={handleInputChange} required/>
            </div>
        </div>

        <div className="containerInput">
        <div>
            <label>Contraseña</label>
            <input type="password" name="contrasena" value={formData.contrasena} onChange={handleInputChange} required/>
        </div>
                   <div>
            <label>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
            </div>
        </div>

        <div>
            <label>Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required />
        </div>
        <div>
            <label>Correo</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required />
        </div>
        <button type="submit">Crear Cliente</button>
        </form>
    </div>
  );
};

export default FormCrearCliente;
