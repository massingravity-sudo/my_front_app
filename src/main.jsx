import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ─── Patch canvas createRadialGradient (évite le crash r1 < 0) ─
const _origRadial = CanvasRenderingContext2D.prototype.createRadialGradient;
CanvasRenderingContext2D.prototype.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
  return _origRadial.call(this, x0, y0, Math.max(0, r0), x1, y1, Math.max(0, r1));
};

// ─── Applique dark mode sur <html> AVANT que React se monte ───
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