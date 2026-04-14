import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ─── Applique dark mode sur <html> AVANT que React se monte ───
// Sans ça, il y a un flash blanc au chargement
const isDark = localStorage.getItem('darkMode') === 'true'
if (isDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

// ─── Applique la langue ────────────────────────────────────────
const lang = localStorage.getItem('language') || 'fr'
document.documentElement.setAttribute('lang', lang)
document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
