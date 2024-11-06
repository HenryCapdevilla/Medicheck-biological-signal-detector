import axios from './axios.js'; // Asegúrate de importar tu instancia de axios

// Función para manejar la subida de la imagen
export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('profileImage', imageFile); // 'profileImage' es el nombre del campo en el formulario

  try {
    // Enviar la imagen al backend
    const response = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Esto es necesario para enviar archivos
      },
    });
    return response.data.filePath; // Retorna la ruta de la imagen subida
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
