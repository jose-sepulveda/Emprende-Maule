import React, { useState } from 'react';
import { createAdmin } from '../services/crearAdmin'; // Asegúrate de tener esta función en tus servicios
import '../Styles/formAdmin.css'; // Asegúrate de que la hoja de estilos esté disponible

const FormCrearAdministrador = () => {
  const [formData, setFormData] = useState({
    rut_administrador: '',
    contrasena: '',
    nombre_administrador: '',
    apellido1_administrador: '',
    apellido2_administrador: '',
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
      await createAdmin(formData); // Llama a la función para crear el administrador
      setMensaje('Administrador creado exitosamente');
      setFormData({
        rut_administrador: '',
        contrasena: '',
        nombre_administrador: '',
        apellido1_administrador: '',
        apellido2_administrador: '',
      });
    } catch (error) {
      setMensaje('Error al crear el administrador');
      console.error(error);
    }
  };

  return (
    <div className='fa-containerFormCrearAdmin'>
      <h2>Crear Cuenta Administrador</h2>
      {mensaje && <p>{mensaje}</p>}
      <form className='fa-form' onSubmit={handleSubmit}>
        <div className="fa-containerInput">
          <div>
            <label className='fa-label'>Nombre</label>
            <input className='fa-input' type="text" name="nombre_administrador" value={formData.nombre_administrador} onChange={handleInputChange} required />
          </div>
          <div>
            <label className='fa-label'>Apellido Paterno</label>
            <input className='fa-input' type="text" name="apellido1_administrador" value={formData.apellido1_administrador} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="fa-containerInput">
          <div>
            <label className='fa-label'>Apellido Materno</label>
            <input className='fa-input' type="text" name="apellido2_administrador" value={formData.apellido2_administrador} onChange={handleInputChange} required />
          </div>
          <div>
            <label className='fa-label'>RUT</label>
            <input className='fa-input' type="text" name="rut_administrador" value={formData.rut_administrador} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="fa-containerInput">
          <div>
            <label className='fa-label'>Contraseña</label>
            <input className='fa-input' type="password" name="contrasena" value={formData.contrasena} onChange={handleInputChange} required />
          </div>
        </div>

        <button className='fa-button' type="submit">Crear Administrador</button>
      </form>
    </div>
  );
};

export default FormCrearAdministrador;
