import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './assets/Broadleaf-Regular.ttf'
import './assets/activistka_regular.ttf'
import './assets/Gothic60-Regular.otf'
import './assets/Newake-Font-Demo.otf'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
