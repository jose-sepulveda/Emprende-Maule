import React, { useState, useEffect, useCallback } from "react";
import { getVentaProductos } from "../services/ventaProductos";  
import { getProductos } from "../services/producto";  
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../Styles/reporteVentas.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReporteVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);  
  const [error, setError] = useState(null);
  const [graficoData, setGraficoData] = useState(null);

  const fetchVentaProductos = useCallback(async () => {
    try {
      const ventasData = await getVentaProductos();  
      setVentas(ventasData);

      const productosData = await getProductos();  
      setProductos(productosData);  

      generarGrafico(ventasData, productosData);  
    } catch (err) {
      setError("Hubo un error al obtener las ventas o productos.");
    }
  }, []); 

  const generarGrafico = (ventasData, productosData) => {
    const productosVendidos = {};

    ventasData.forEach((venta) => {
      const producto = productosData.find((prod) => prod.cod_producto === venta.cod_producto);
      const nombreProducto = producto ? producto.nombre_producto : 'Producto no encontrado';

      if (productosVendidos[nombreProducto]) {
        productosVendidos[nombreProducto] += venta.cantidad;
      } else {
        productosVendidos[nombreProducto] = venta.cantidad;
      }
    });

    const labels = Object.keys(productosVendidos); 
    const data = Object.values(productosVendidos);  

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Cantidad Vendida',
          data: data,
          backgroundColor: '#f98511d9',
          borderColor: 'orange',
          borderWidth: 1,
        },
      ],
    };

    setGraficoData(chartData);  
  };

  useEffect(() => {
    fetchVentaProductos();  
  }, [fetchVentaProductos]); 

  return (
    <div className="reporte-container">
      <h1 className="reporte-title">Reporte de Ventas</h1>
      {error && <p className="reporte-error">{error}</p>}

      <h2 className="reporte-subtitle">Producto Más Vendido</h2>
      {graficoData ? (
        <div className="reporte-chart-container">
          <Bar 
            data={graficoData} 
            options={{
              responsive: true, 
              plugins: { legend: { position: 'top' } },
              scales: {
                y: {
                  ticks: {
                    stepSize: 1, 
                    callback: function(value) {
                      return Number.isInteger(value) ? value : ''; 
                    }
                  }
                }
              }
            }} 
          />
        </div>
      ) : (
        <p className="reporte-loading-text">Cargando gráfico...</p>
      )}

      <table className="reporte-table">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Nombre Producto</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 ? (
            <tr>
              <td colSpan="4">No hay ventas productos disponibles.</td>
            </tr>
          ) : (
            ventas.map((venta) => {
              const producto = productos.find((prod) => prod.cod_producto === venta.cod_producto);
              const nombreProducto = producto ? producto.nombre_producto : 'Producto no encontrado';
              return (
                <tr key={venta.id_venta_productos}>
                  <td>{venta.id_venta}</td>
                  <td>{nombreProducto}</td> 
                  <td>{venta.cantidad}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteVentas;
