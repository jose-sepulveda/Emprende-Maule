import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { sendContactRequest } from '../services/contacto';
import '../Styles/contacto.css'; // Estilos


const ContactForm = () => {
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
  
    const onSubmit = async (data) => {
      setLoading(true);
      try {
        const response = await sendContactRequest(data);
        console.log('Respuesta del servidor:', response);
        toast.success('Tu solicitud fue enviada con éxito. Pronto nos pondremos en contacto.');
        reset();
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Ocurrió un problema al enviar tu solicitud.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="form-container">
        <h2>Contacto</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ingresa tu nombre"
              required
              {...register('nombre')}
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              type="email"
              placeholder="Ingresa tu correo"
              required
              {...register('correo')}
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="categoria_consulta">Categoría de Consulta</label>
            <select id="categoria_consulta" required {...register('categoria_consulta')}>
              <option value="">Seleccionar categoría</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Información General">Información General</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
  
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              rows="5"
              placeholder="Escribe tu mensaje aquí..."
              required
              {...register('mensaje')}
            />
          </div>
  
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    );
  };
  
  export default ContactForm;