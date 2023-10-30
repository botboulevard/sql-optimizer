import {
  Box,
  ChakraProvider,
  Grid,
  VStack,
  theme
} from "@chakra-ui/react";
import { useEffect } from "react";
import { io } from 'socket.io-client';
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import ChatPage from "./components/ChatPage";

const socketUrl = `${window.location.protocol}//${window.location.hostname}/`;

console.log('socketUrl :: ', socketUrl);

export const socket = io("http://localhost:5001", {
  transports: ['websocket', 'polling']
});


export const App = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to socket', socket);
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });
    // return () => {
    //   console.log('disconnecting');
    //   socket.disconnect();
    // };
  }, []);

  console.log('socket :: ', theme);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="left" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <ChatPage />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  )
}
