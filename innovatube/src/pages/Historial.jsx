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

export default function Historial() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/historial', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        setHistorial(res.data || []);
      } catch (err) {
        console.error('Error al cargar historial');
      } finally {
        setCargando(false); 
      }
    };

    cargarHistorial();
  }, []);


  const eliminarHistorial = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/historial/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorial((prev) => prev.filter((v) => v.videoId !== videoId));
      toast({
        title: 'Eliminado',
        description: 'El video se quitó del historial',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar del historial',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Box maxW="6xl" mx="auto" px={4} py={6}>
      <Heading mb={6} textAlign="center">
        Historial
      </Heading>

      {cargando ? (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      ) : historial.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No hay historial disponible.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {historial.map((video) => (
            <Box key={video.videoId} bg="white" p={3} boxShadow="md" rounded="md">
              <Image src={video.url} alt={video.titulo} borderRadius="md" />
              <Text mt={2} fontWeight="semibold" noOfLines={2}>
                {video.titulo}
              </Text>
              <Button
                mt={3}
                colorScheme="red"
                size="sm"
                onClick={() => eliminarHistorial(video.videoId)}
              >
                Quitar del historial
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
