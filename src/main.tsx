import { CssBaseline, CssVarsProvider } from '@mui/joy'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="system">
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>
)
