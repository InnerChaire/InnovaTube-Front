const API_KEY = 'AIzaSyCiVMu6_I87Kd4TX-TazhjqICGbFET5G4U'; // Reemplázala por tu clave real

export const buscarVideos = async (query) => {
  const respuesta = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=12`
  );
  const data = await respuesta.json();
  return data.items;
};
