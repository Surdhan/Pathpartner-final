import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, theme } from '@chakra-ui/react';
import App from "./components/user/App";


ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
