import React, { useState, useEffect } from 'react';
import '../Styles/categoria.css';
import { createAdmin, deleteAdmin, getAdministradores, updateAdmin } from '../services/admin';

const GestionAdmin = () => {
  const [administradores, setAdministradores] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState({
    id_administrador: '',
    nombre_administrador: '',
    apellido1_administrador: '',
    apellido2_administrador: '',
    rut_administrador: '',
    contrasena: '',
  });

  useEffect(() => {
    cargarAdministradores();
  }, []);

  // Cargar administradores 
  const cargarAdministradores = async () => {
    try {
      const response = await getAdministradores();
      const sortedAdministradores = response.data.sort((a, b) => a.id_administrador - b.id_administrador);
      setAdministradores(sortedAdministradores);
    } catch (error) {
      console.error('Error al encontrar administradores:', error);
      alert('Error al cargar administradores');
    }
  };

  // Eliminar administradores 
  const handleDelete = async (id_administrador) => {
    try {
      await deleteAdmin(id_administrador);
      cargarAdministradores(); 
    } catch (error) {
      console.error('Error eliminar administrador:', error);
      alert('Error al eliminar administrador');
    }
  };

  // Editar administradores 
  const handleEdit = (admin) => {
    setEditMode(true);
    setEditedAdmin(admin);
  };

  // Crear administradores 
  const handleCreate = () => {
    setEditMode(false);
    setEditedAdmin({
      id_administrador: '',
      nombre_administrador: '',
      apellido1_administrador: '',
      apellido2_administrador: '',
      rut_administrador: '',
      contrasena: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editedAdmin.id_administrador) {
        await updateAdmin(editedAdmin.id_administrador, editedAdmin);
      } else {
        await createAdmin(editedAdmin);
      }
      cargarAdministradores(); 
      setEditedAdmin({
        id_administrador: '', 
        nombre_administrador: '', 
        apellido1_administrador: '', 
        apellido2_administrador: '', 
        rut_administrador: '', 
        contrasena: '',
      }); 
      setEditMode(false); // Salir del modo edición
    } catch (error) {
      console.error('Error actualizar/crear administrador:', error);
      alert('Error al guardar administrador');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedAdmin({
      ...editedAdmin,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <h1>Gestión de Administradores</h1>

      <form onSubmit={handleSubmit}>
        <input
          className='inputAdmin'
          type="text"
          name="nombre_administrador"
          value={editedAdmin.nombre_administrador}
          onChange={handleChange}
          placeholder="Nombre Administrador"
          required
        />
        <input
          className='inputAdmin'
          type="text"
          name="apellido1_administrador"
          value={editedAdmin.apellido1_administrador}
          onChange={handleChange}
          placeholder="Primer Apellido"
          required
        />
        <input
          className='inputAdmin'
          type="text"
          name="apellido2_administrador"
          value={editedAdmin.apellido2_administrador}
          onChange={handleChange}
          placeholder="Segundo Apellido"
        />
        <input
          className='inputAdmin'
          type="text"
          name="rut_administrador"
          value={editedAdmin.rut_administrador}
          onChange={handleChange}
          placeholder="RUT"
          required
        />
        <input
          className='inputAdmin'
          type="password"
          name="contrasena"
          value={editedAdmin.contrasena}
          onChange={handleChange}
          placeholder="Contraseña"
          required
        />
        <button id="guardar" className="btn-guardar" type="submit">{editMode ? 'Actualizar' : 'Crear'} Administrador</button>
        {editMode && (
          <button type="button" className="btn-cancelar" id="cancelar" onClick={() => setEditMode(false)}>Cancelar</button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {administradores.map((admin) => (
            <tr key={admin.id_administrador}>
              <td>{admin.id_administrador}</td>
              <td>{admin.nombre_administrador}</td>
              <td>{admin.rut_administrador}</td>
              <td>
                <button id="editar" className="btn-editar" onClick={() => handleEdit(admin)}>Editar</button>
                <button id="eliminar" className="btn-eliminar" onClick={() => handleDelete(admin.id_administrador)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { GestionAdmin };
