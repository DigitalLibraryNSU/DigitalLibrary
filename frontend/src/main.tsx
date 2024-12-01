import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './assets/Broadleaf-Regular.ttf'
import './assets/Newake-Font-Demo.otf'
import "./assets/Rubik-BoldItalic.ttf"
import "./assets/Rubik-Italic.ttf"
import "./assets/Rubik-Bold.ttf"
import "./assets/Rubik-Regular.ttf"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
