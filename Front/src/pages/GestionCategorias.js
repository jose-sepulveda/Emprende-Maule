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

  // Cargar categorías 
  const cargarCategorias = async () => {
    try {
      const response = await getCategorias();
      // ordena las id 
      const sortedCategorias = response.data.sort((a, b) => a.id_categoria - b.id_categoria);
      setCategorias(sortedCategorias);
    } catch (error) {
      console.error('Error al encontrar categorías:', error);
      alert('Error al cargar categorías');
    }
  };

  // Eliminar categorías 
  const handleDelete = async (id_categoria) => {
    try {
      await deleteCategoria(id_categoria);
      cargarCategorias(); 
    } catch (error) {
      console.error('Error deleting categoría:', error);
      alert('Error al eliminar categoría');
    }
  };

  //editar categorias 
  const handleEdit = (categoria) => {
    setEditMode(true);
    setEditedCategoria(categoria);
  };

  //crear categorias 
  const handleCreate = () => {
    setEditMode(false);
    setEditedCategoria({
      id_categoria: '',
      nombre_categoria: '',
      estado_categoria: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editedCategoria.id_categoria) {
        await updateCategoria(editedCategoria.id_categoria, editedCategoria);
      } else {
        await createCategoria(editedCategoria);
      }
      cargarCategorias(); 
      setEditedCategoria({ id_categoria: '', nombre_categoria: '', estado_categoria: true }); // se reinicia el formulario
      setEditMode(false); // aqui se sale del modo edición
    } catch (error) {
      console.error('Error actualizar/crear categoría:', error);
      alert('Error al guardar categoría');
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditedCategoria({
      ...editedCategoria,
      [name]: newValue,
    });
  };

  // estado del switch
  const handleToggleState = async (categoria) => {
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
    <div className="container">
      <h1>Gestión de Categorías</h1>

      <form onSubmit={handleSubmit}>
        <input
          className='inputCategoria'
          type="text"
          name="nombre_categoria"
          value={editedCategoria.nombre_categoria}
          onChange={handleChange}
          placeholder="Nombre de la Categoría"
          required
        />
        <button id="guardar" className="btn-guardar" type="submit">{editMode ? 'Actualizar' : 'Crear'} Categoría</button>
        {editMode && (
          <button type="button" className="btn-cancelar" id="cancelar" onClick={() => setEditMode(false)}>Cancelar</button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id_categoria}>
              <td>{categoria.id_categoria}</td>
              <td>{categoria.nombre_categoria}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="estado_categoria"
                    checked={categoria.estado_categoria}
                    onChange={() => handleToggleState(categoria)} // Actualizar el estado al cambiar el switch
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button id="editar" className="btn-editar" onClick={() => handleEdit(categoria)}>Editar</button>
                <button id="eliminar" className="btn-eliminar" onClick={() => handleDelete(categoria.id_categoria)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { GestionCategorias };
