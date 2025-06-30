import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Button,
  Show,
  Hide,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const enlacesPrivados = [
    { texto: 'Inicio', ruta: '/' },
    { texto: 'Favoritos', ruta: '/favoritos' },
    { texto: 'Historial', ruta: '/historial' },
  ];

  const enlacesPublicos = [
    { texto: 'Iniciar sesión', ruta: '/login' },
    { texto: 'Registrarse', ruta: '/registro' },
  ];

  return (
    <>
      <Flex
        as="nav"
        bg="blue.600"
        color="white"
        px={4}
        py={3}
        align="center"
        justify="space-between"
        boxShadow="md"
      >
        <Box fontWeight="bold">InnovaTube</Box>

        <Show above="md">
          <Flex gap={4} align="center">
            {(usuario ? enlacesPrivados : enlacesPublicos).map((enlace) => (
              <Button
                key={enlace.ruta}
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={() => navigate(enlace.ruta)}
              >
                {enlace.texto}
              </Button>
            ))}

            {usuario && (
              <>
                <Text fontSize="sm" fontWeight="medium">
                  👤 {usuario.nombre}
                </Text>
                <Button colorScheme="red" onClick={cerrarSesion}>
                  Salir
                </Button>
              </>
            )}
          </Flex>
        </Show>

        <Hide above="md">
          <IconButton
            icon={<HamburgerIcon />}
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={onOpen}
            aria-label="Abrir menú"
          />
        </Hide>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody mt={10}>
            <VStack align="stretch" spacing={4}>
              {(usuario ? enlacesPrivados : enlacesPublicos).map((enlace) => (
                <Button
                  key={enlace.ruta}
                  onClick={() => {
                    navigate(enlace.ruta);
                    onClose();
                  }}
                >
                  {enlace.texto}
                </Button>
              ))}
              {usuario && (
                <>
                  <Text fontSize="sm">👤 {usuario.nombre}</Text>
                  <Button colorScheme="red" onClick={cerrarSesion}>
                    Cerrar sesión
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
