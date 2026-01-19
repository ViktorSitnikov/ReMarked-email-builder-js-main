import React from 'react';
import ReactDOM from 'react-dom/client';

import { ScopedCssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import { LocalizationProvider } from './App/LocalizationContext';
import theme from './theme';
import { LoaderProvider } from './App/LoaderContext';
import { NotificationProvider } from './App/NotificationContext';

ReactDOM.createRoot(document.getElementById('emailBuilder')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider>
        <LoaderProvider>
          <NotificationProvider>
            <ScopedCssBaseline>
              <App />
            </ScopedCssBaseline>
          </NotificationProvider>
        </LoaderProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
