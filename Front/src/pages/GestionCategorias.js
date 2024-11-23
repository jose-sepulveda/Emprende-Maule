import React, { useState, useEffect } from 'react';
import { getCategorias, deleteCategoria, createCategoria, updateCategoria } from '../services/categoria';
import '../Styles/categoria.css';

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedCategoria, setEditedCategoria] = useState({
    id_categoria: '',
    nombre_categoria: '',
    estado_categoria: false,
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await getCategorias();
      const sortedCategorias = response.data.sort((a, b) => a.id_categoria - b.id_categoria);
      setCategorias(sortedCategorias);
    } catch (error) {
      console.error('Error al encontrar categorías:', error);
      alert('Error al cargar categorías');
    }
  };

  const eliminarCategoriaCreada = async (id_categoria) => {
    try {
      await deleteCategoria(id_categoria);
      cargarCategorias();
    } catch (error) {
      console.error('Error deleting categoría:', error);
      alert('Error al eliminar categoría');
    }
  };

  const editarCategoriaCreada = (categoria) => {
    setEditMode(true);
    setEditedCategoria(categoria);
  };

  const formularioCrearActualizar = async (event) => {
    event.preventDefault();
    try {
      if (editedCategoria.id_categoria) {
        await updateCategoria(editedCategoria.id_categoria, editedCategoria);
      } else {
        await createCategoria(editedCategoria);
      }
      cargarCategorias();
      setEditedCategoria({ id_categoria: '', nombre_categoria: '', estado_categoria: true });
      setEditMode(false);
    } catch (error) {
      console.error('Error actualizar/crear categoría:', error);
      alert('Error al guardar categoría');
    }
  };

  const inputCategoria = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditedCategoria({
      ...editedCategoria,
      [name]: newValue,
    });
  };

  const estadoDeCategoria = async (categoria) => {
    const updatedCategoria = {
      ...categoria,
      estado_categoria: !categoria.estado_categoria,
    };

    try {
      await updateCategoria(categoria.id_categoria, updatedCategoria);
      cargarCategorias();
    } catch (error) {
      console.error('Error al actualizar el estado_categoria:', error);
      alert('Error al actualizar el estado de la categoría');
    }
  };

  return (
    <div className="gestion-categorias-container">
      <h1>Gestión de Categorías</h1>

      <form onSubmit={formularioCrearActualizar}>
        <input
          className='gestion-categorias-input'
          type="text"
          name="nombre_categoria"
          value={editedCategoria.nombre_categoria}
          onChange={inputCategoria}
          placeholder="Nombre de la Categoría"
          required
        />
        <button id="guardar" className="gestion-categorias-btn gestion-categorias-btn-guardar" type="submit">{editMode ? 'Actualizar' : 'Crear'} Categoría</button>
        {editMode && (
          <button type="button" className="gestion-categorias-btn gestion-categorias-btn-cancelar" id="cancelar" onClick={() => setEditMode(false)}>Cancelar</button>
        )}
      </form>

      <table className="gestion-categorias-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id_categoria}>
              <td>{categoria.nombre_categoria}</td>
              <td>
                <label className="gestion-categorias-switch">
                  <input
                    type="checkbox"
                    name="estado_categoria"
                    checked={categoria.estado_categoria}
                    onChange={() => estadoDeCategoria(categoria)} 
                  />
                  <span className="gestion-categorias-slider round"></span>
                </label>
              </td>
              <td>
                <button id="editar" className="gestion-categorias-btn gestion-categorias-btn-editar" onClick={() => editarCategoriaCreada(categoria)}>Editar</button>
                <button id="eliminar" className="gestion-categorias-btn gestion-categorias-btn-eliminar" onClick={() => eliminarCategoriaCreada(categoria.id_categoria)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { GestionCategorias };
