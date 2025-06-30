import {
  Box,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Button,
  Flex,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const toast = useToast();

  const cargarFavoritos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/favoritos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setFavoritos(
        (res.data || []).map((v) => ({
          videoId: v.video_id,
          titulo: v.titulo,
          url: v.url,
        }))
      );

    } catch (err) {
      console.error('Error al obtener favoritos', err);
    } finally {
      setCargando(false);
    }
  };

  const eliminarFavorito = async (videoId) => {
    try {
      const token = localStorage.getItem('token');

      await API.delete(`/favoritos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoritos((prev) => prev.filter((v) => v.videoId !== videoId));

      toast({
        title: 'Eliminado',
        description: 'El video se quitó de tus favoritos',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
        toast({
        title: 'Error',
        description: 'No se pudo cargar los favoritos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  return (
    <Box maxW="6xl" mx="auto" px={4} py={6}>
      <Heading mb={6} textAlign="center">
        Mis Favoritos
      </Heading>

      {cargando ? (
        <Flex justify="center">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : favoritos.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No tienes videos favoritos guardados.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {favoritos.map((video) => (
            <Box key={video.video_id} bg="white" p={3} boxShadow="md" rounded="md">
              <Image
                src={video.url}
                alt={video.titulo}
                borderRadius="md"
              />
              <Text mt={2} fontWeight="semibold" noOfLines={2}>
                {video.titulo}
              </Text>

              <Button
                mt={3}
                colorScheme="red"
                size="sm"
                onClick={() => eliminarFavorito(video.videoId)}
              >
                Quitar favorito
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
