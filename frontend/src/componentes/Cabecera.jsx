import React, { useState } from 'react';

export default function Cabecera({ alCambiarVista, cantidadFavoritos }) {
  const [errorImagen, setErrorImagen] = useState(false);

  return (
    <header className="site-header">
      <div 
        onClick={() => alCambiarVista('inicio')} 
        className="header-brand" 
        style={{ cursor: 'pointer' }}
      >
        {!errorImagen ? (
          <img 
            src="/src/assets/logo.png" 
            alt="ReUse Logo" 
            className="header-logo"
            onError={() => setErrorImagen(true)}
          />
        ) : null}
        <span className="header-title">ReUse</span>
      </div>

      <div className="header-search">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Buscar celulares, notebooks, consolas..." 
          readOnly 
        />
      </div>

      <nav className="header-nav">
        <button 
          className="btn-ingresar" 
          onClick={() => alCambiarVista('favoritos')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>❤️ Favoritos</span>
          {cantidadFavoritos > 0 && (
            <span style={{ backgroundColor: 'var(--esmeralda)', color: '#FFF', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {cantidadFavoritos}
            </span>
          )}
        </button>

        <button 
          className="btn-vender" 
          onClick={() => alCambiarVista('publicar')}
        >
          + Vender
        </button>
      </nav>
    </header>
  );
}
