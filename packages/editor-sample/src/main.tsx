import React from 'react';
import ReactDOM from 'react-dom/client';

import { ScopedCssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import { LocalizationProvider } from './App/LocalizationContext';
import theme from './theme';
import { LoaderProvider } from './App/LoaderContext';

ReactDOM.createRoot(document.getElementById('emailBuilder')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider>
        <LoaderProvider>
          <ScopedCssBaseline>
            <App />
          </ScopedCssBaseline>
        </LoaderProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
