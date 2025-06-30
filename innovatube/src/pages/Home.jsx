import {
  Box,
  Input,
  Button,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Spinner,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { buscarVideos } from '../api/youtube';
import { useFavoritos } from '../hooks/useFavoritos';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

export default function Home() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const toast = useToast();
  const { esFavorito, agregarFavorito, quitarFavorito } = useFavoritos();
  const { usuario } = useAuth();

  const guardarEnHistorial = async (video) => {
    try {
      const token = localStorage.getItem('token');
      const videoId = video.id?.videoId || video.id;
      const titulo = video.snippet?.title;

      console.log(videoId, titulo);
      if (!videoId || !titulo) return;

      const entrada = {
        videoId,
        titulo,
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      };

      await API.post('/historial', entrada, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('No se pudo guardar en historial', err);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setCargando(true);
    try {
      const resultados = await buscarVideos(query);
      setVideos(resultados);
    } catch (err) {
      console.error('Error al buscar videos:', err);
      toast({
        title: 'Error',
        description: 'No se pudo realizar la búsqueda',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box maxW="6xl" mx="auto" px={4} py={6}>
      <Heading mb={6} textAlign="center">
        Buscar videos en YouTube
      </Heading>

      <form onSubmit={handleBuscar}>
        <Flex mb={6} gap={4} direction={{ base: 'column', sm: 'row' }}>
          <Input
            placeholder="¿Qué quieres ver?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="md"
          />
          <Button colorScheme="blue" type="submit">
            Buscar
          </Button>
        </Flex>
      </form>

      {cargando && (
        <Flex justify="center">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}

      {!cargando && videos.length > 0 && (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {videos.map((video) => {
            const videoId = video.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            return (
              <Box
                key={videoId}
                bg="white"
                p={3}
                boxShadow="md"
                borderRadius="md"
              >
                <Box
                  cursor="pointer"
                  onClick={async () => {
                    console.log(usuario);
                    if (usuario) {
                      await guardarEnHistorial(video);
                    }
                    window.open(videoUrl, '_blank');
                  }}
                >
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    borderRadius="md"
                  />
                  <Text mt={2} fontWeight="semibold" noOfLines={2}>
                    {video.snippet.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {video.snippet.channelTitle}
                  </Text>
                </Box>

                <Button
                  mt={3}
                  size="sm"
                  colorScheme={esFavorito(videoId) ? 'red' : 'blue'}
                  onClick={async () => {
                    const videoData = {
                      videoId,
                      titulo: video.snippet.title,
                      url: video.snippet.thumbnails.default.url,
                    };

                    if (esFavorito(videoId)) {
                      const ok = await quitarFavorito(videoId);
                      if (ok) {
                        toast({
                          title: 'Favorito eliminado',
                          description: 'Se eliminó el video de tus favoritos.',
                          status: 'info',
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    } else {
                      const ok = await agregarFavorito(videoData);
                      if (ok) {
                        toast({
                          title: 'Favorito guardado',
                          description: 'El video fue agregado a tus favoritos.',
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    }
                  }}
                >
                  {esFavorito(videoId) ? 'Quitar favorito' : 'Agregar a favoritos'}
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
}
