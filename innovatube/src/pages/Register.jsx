import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    usuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await API.post('/usuarios/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={16} px={6} py={8} bg="white" boxShadow="md" borderRadius="lg">
      <Heading mb={6} size="lg" textAlign="center">
        Registro
      </Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Apellido</FormLabel>
            <Input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Usuario</FormLabel>
            <Input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              name="password"
              value={form.contraseña}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Registrarse
          </Button>
        </VStack>
      </form>

      <Text mt={4} fontSize="sm" textAlign="center">
        ¿Ya tienes cuenta?{' '}
        <Button variant="link" onClick={() => navigate('/login')}>
          Inicia sesión
        </Button>
      </Text>
    </Box>
  );
}
