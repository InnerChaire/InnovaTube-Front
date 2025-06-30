import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const { setUsuario } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [recaptchaValido, setRecaptchaValido] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (value) => {
    setRecaptchaValido(!!value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!recaptchaValido) {
        toast({
          title: 'Captcha requerido',
          description: 'Por favor verifica que no eres un robot.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }     
      const res = await API.post('/usuarios/login', form);
      localStorage.setItem('token', res.data.token);
      setUsuario(res.data.usuario);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={16} px={6} py={8} bg="white" boxShadow="md" borderRadius="lg">
      <Heading mb={6} size="lg" textAlign="center">
        Iniciar Sesión
      </Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="correo" isRequired>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="tucorreo@example.com"
            />
          </FormControl>

          <FormControl id="contraseña" isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              name="password"
              value={form.contraseña}
              onChange={handleChange}
              placeholder="Contraseña"
            />
          </FormControl>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Lf2gnIrAAAAAIYT01LqOYPQxYx3Tdn9_we-vw2f"
            onChange={handleCaptcha}
          />

          <Button colorScheme="blue" width="full" type="submit">
            Iniciar sesión
          </Button>
        </VStack>
      </form>

      <Text mt={4} fontSize="sm" textAlign="center">
        ¿No tienes cuenta? <Button variant="link" onClick={() => navigate('/registro')}>Regístrate</Button>
      </Text>
    </Box>
  );
}
