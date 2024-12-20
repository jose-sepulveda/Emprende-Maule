import axios from 'axios';

const API_URL = 'http://localhost:3000/api/producto';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Crear producto
export const crearProducto = (producto) => {
    const formData = new FormData();

    for (const key in producto) {
        if (key === 'imagen') {
            formData.append('imagen', producto.imagen);
        } else {
            formData.append(key, producto[key]);
        }
    }

    return api.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


// Obtener todos los productos
export const getProductos = async () => {
    try {
        const response = await api.get('/list'); 
        return response.data; 
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw error;
    }
};


export const eliminarProducto = async (cod_producto) => {
    try {
        const response = await api.delete(`/${cod_producto}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        throw error;
    }
};

// Actualizar producto 
export const actualizarProducto = async (cod_producto, producto) => {
    try {
        const response = await api.put(`/${cod_producto}`, {
            nombre_producto: producto.nombre_producto,
            precio_producto: producto.precio_producto,
            descripcion_producto: producto.descripcion_producto,
            id_categoria: producto.id_categoria,
            cantidad_disponible:producto.cantidad_disponible
            
        });
        return response.data; 
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        throw error;
    }
};


// Actualizar Imagen y Descuento
export const updateImagenYDescuento = (cod_producto, data) => {
    const formData = new FormData();
    if (data.imagen) {
        formData.append('imagen', data.imagen);
    }
    formData.append('precio_producto', data.precio_producto || '');
    formData.append('descuento', data.descuento || '');

    return api.put(`/${cod_producto}/actualizar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//Filtro de productos por categoria 
export const getProductosByCategoria = async (id_categoria) => {
    try {
        const response = await api.get(`/categoria/${id_categoria}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        throw error;
    }
};


export const obtenerProductosPorEmprendedor = async (id_emprendedor) => {
    try {
        const response = await api.get(`/emprendedor/${id_emprendedor}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos por emprendedor:", error);
        throw error;
    }
};

