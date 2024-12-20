import React, { useState } from 'react';
import { createCliente } from '../services/crearCliente';
import { toast } from 'react-toastify'; 
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

  const gestionInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const logicaEnvioDatosF = async (e) => {
    e.preventDefault();
    try {
      await createCliente(formData);
      toast.success('Cliente creado exitosamente'); 
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
      toast.error('Error al crear el cliente'); 
      console.error(error);
    }
  };

  return (
    <div className='form-container-cliente'>
      <h2>Crear Cuenta Cliente</h2>
      <form className='form-cliente' onSubmit={logicaEnvioDatosF}>
          <div>
            <label className='fc-label'>Nombre</label>
            <input className='fc-input' type="text" name="nombre_cliente" value={formData.nombre_cliente} onChange={gestionInput} required />
          </div>

          <div>
            <label className='fc-label'>Apellido Paterno</label>
            <input className='fc-input' type="text" name="apellido1_cliente" value={formData.apellido1_cliente} onChange={gestionInput} required />
          </div>

          <div>
            <label className='fc-label'>Apellido Materno</label>
            <input className='fc-input' type="text" name="apellido2_cliente" value={formData.apellido2_cliente} onChange={gestionInput} required/>
          </div>

          <div>
            <label className='fc-label'>RUT</label>
            <input className='fc-input' type="text" name="rut_cliente" value={formData.rut_cliente} onChange={gestionInput} required/>
          </div>
      
          <div>
            <label className='fc-label'>Contraseña</label>
            <input className='fc-input' type="password" name="contrasena" value={formData.contrasena} onChange={gestionInput} required/>
          </div>

          <div>
            <label className='fc-label'>Teléfono</label>
            <input className='fc-input' type="text" name="telefono" value={formData.telefono} onChange={gestionInput} required />
          </div>
      
          <div>
            <label className='fc-label'>Dirección</label>
            <input className='fc-input' type="text" name="direccion" value={formData.direccion} onChange={gestionInput} required />
          </div>

          <div>
            <label className='fc-label'>Correo</label>
            <input className='fc-input' type="email" name="correo" value={formData.correo} onChange={gestionInput} required />
          </div>

          <button className='fc-button' type="submit">Crear Cliente</button>
      </form>
    </div>
  );
};

export default FormCrearCliente;
