import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Auth/AuthContext'; // Ajusta la ruta de importación según tu estructura
import { getVentasCliente, deleteVenta } from '../services/ventas'; // Asegúrate de que la ruta de importación sea correcta
import '../Styles/detalleVentaC.css'; // Importa el archivo CSS con las clases personalizadas

const DetalleVentaC = () => {
  const { auth } = useContext(AuthContext); // Obtienes el ID del cliente desde el contexto de autenticación
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (auth.id) {
      const fetchVentas = async () => {
        try {
          const ventasData = await getVentasCliente(auth.id); // Llamamos a la API con el id del cliente
          setVentas(ventasData); // Establecemos las ventas en el estado
        } catch (error) {
          setError(error.message); // En caso de error, actualizamos el estado de error
        } finally {
          setLoading(false); // Terminamos el loading
        }
      };

      fetchVentas();
    }
  }, [auth.id]); // Solo se ejecuta cuando el id del cliente cambia

  const handleDelete = async (id_venta) => {
    try {
      // Llamamos a la función deleteVenta
      const response = await deleteVenta(id_venta);
      alert(response.msg); // Mostrar un mensaje de éxito
      setVentas(ventas.filter((venta) => venta.id_venta !== id_venta)); // Actualizamos la lista de ventas
    } catch (error) {
      alert('Error al eliminar la venta: ' + error.message);
    }
  };

  if (loading) return <div className="detalle-venta-message">Cargando ventas...</div>;

  if (error) return <div className="detalle-venta-error">Error: {error}</div>;

  return (
    <div className="detalle-venta-container">
      <div>
        <h2 className="detalle-venta-heading">Ventas del Cliente</h2>
        {ventas.length === 0 ? (
          <p className="detalle-venta-message">No se encontraron ventas para este cliente.</p>
        ) : (
          <table className="detalle-venta-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Descuentos</th>
                <th>Total</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th>Acciones</th> {/* Nueva columna para las acciones */}
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id_venta}>
                  <td>{venta.id_venta}</td>
                  <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                  <td>${venta.subtotal}</td>
                  <td>${venta.iva}</td>
                  <td>${venta.descuentos}</td>
                  <td>${venta.total}</td>
                  <td>{venta.metodo_de_pago}</td>
                  <td>{venta.estado_de_venta}</td>
                  <td>
                    <button
                      className="detalle-venta-delete-btn"
                      onClick={() => handleDelete(venta.id_venta)} // Llamar a la función de eliminación
                    >
                      Eliminar
                    </button>
                  </td> {/* Columna de acciones con el botón de eliminar */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DetalleVentaC;
