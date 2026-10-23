/**
 * Punto de entrada de la aplicación.
 * Importa los estilos de PrimeReact y monta el componente raíz <App />.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';

import App from './App.jsx';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);