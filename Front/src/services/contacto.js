import axios from 'axios';

const API_URL = 'http://localhost:3000/api/contacto'

export const sendContactRequest = async (contacto) => {
    try {
      const response = await axios.post(`${API_URL}/new`, contacto, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud de contacto:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'No se pudo enviar tu solicitud de contacto.');
    }
  };
