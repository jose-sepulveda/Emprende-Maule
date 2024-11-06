// src/components/CrearProducto.js
import React, { useState } from 'react';
import { crearProducto } from '../services/producto';

const CrearProducto = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [descuento, setDescuento] = useState('');
  const [imagen, setImagen] = useState(null);

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append('nombre_producto', nombreProducto);
    formData.append('precio_producto', precioProducto);
    formData.append('descripcion_producto', descripcionProducto);
    formData.append('id_categoria', idCategoria);
    formData.append('cantidad_disponible', cantidadDisponible);
    formData.append('descuento', descuento);
    formData.append('imagen', imagen); // Agrega el archivo de imagen

    try {
      const response = await crearProducto(formData);
      console.log('Producto creado:', response);
      // Muestra una notificación o limpia el formulario aquí
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre del Producto:</label>
        <input
          type="text"
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Precio del Producto:</label>
        <input
          type="number"
          value={precioProducto}
          onChange={(e) => setPrecioProducto(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descripción del Producto:</label>
        <textarea
          value={descripcionProducto}
          onChange={(e) => setDescripcionProducto(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Categoría:</label>
        <input
          type="number"
          value={idCategoria}
          onChange={(e) => setIdCategoria(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Cantidad Disponible:</label>
        <input
          type="number"
          value={cantidadDisponible}
          onChange={(e) => setCantidadDisponible(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descuento (%):</label>
        <input
          type="number"
          value={descuento}
          onChange={(e) => setDescuento(e.target.value)}
        />
      </div>
      <div>
        <label>Imagen:</label>
        <input type="file" onChange={handleImageChange} required />
      </div>
      <button type="submit">Crear Producto</button>
    </form>
  );
};

export default CrearProducto;
