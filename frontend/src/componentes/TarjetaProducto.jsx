import React from 'react';
import InsigniaEstado from './InsigniaEstado';

export default function TarjetaProducto({ producto, alHacerClick, esFavorito, alAlternarFavorito }) {
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      {/* Botón de favoritos */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          alAlternarFavorito(producto.id);
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          fontSize: '1.2rem',
          zIndex: 2,
          transition: 'transform 0.2s'
        }}
        title={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
      >
        {esFavorito ? '❤️' : '🤍'}
      </button>

      <div onClick={() => alHacerClick(producto.id)} style={{ cursor: 'pointer' }}>
        <div className="product-card-img">
          Foto
        </div>
        <div className="product-card-body">
          <div className="product-card-header-row">
            <span className="product-price">{formatearPrecio(producto.precio)}</span>
            <InsigniaEstado condicion={producto.condicion} />
          </div>
          <h3 className="product-title">{producto.titulo}</h3>
          <div className="product-location">
            <span>📍</span>
            <span>{producto.ubicacion.ciudad}, {producto.ubicacion.zona}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
