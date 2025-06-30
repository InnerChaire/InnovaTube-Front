import { useState } from 'react';
import API from '../api/axios';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);

  const esFavorito = (videoId) =>
    favoritos.some((v) => v.videoId === videoId);

  const agregarFavorito = async (video) => {
    console.log(video);
    try {
      const token = localStorage.getItem('token');

      const favorito = {
        videoId: video.videoId,
        titulo: video.titulo,
        url: `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`, 
      };

      console.log(favorito);

      await API.post('/favoritos', favorito, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritos((prev) => [...prev, favorito]);
      return true;
    } catch (err) {
      console.error('Error al agregar favorito', err);
      return false;
    }
  };


  const quitarFavorito = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
        await API.delete(`/favoritos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritos((prev) => prev.filter((v) => v.videoId !== videoId));
      return true;
    } catch (err) {
      console.error('Error al quitar favorito', err);
      return false;
    }
  };

  return {
    favoritos,
    esFavorito,
    agregarFavorito,
    quitarFavorito,
  };
};
