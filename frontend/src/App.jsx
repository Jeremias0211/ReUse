import React, { useState, useEffect } from 'react';
import Cabecera from './componentes/Cabecera';
import Inicio from './paginas/Inicio';
import DetalleProducto from './paginas/DetalleProducto';
import Publicar from './paginas/Publicar';

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio'); // 'inicio', 'detalle', 'publicar', 'favoritos'
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);

  // Estado de favoritos persistido en localStorage
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const guardados = localStorage.getItem('reuse_favoritos');
      return guardados ? JSON.parse(guardados) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('reuse_favoritos', JSON.stringify(favoritos));
    } catch (e) {
      console.error("Error al guardar favoritos:", e);
    }
  }, [favoritos]);

  const alternarFavorito = (id) => {
    setFavoritos(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const seleccionarProducto = (id) => {
    setProductoSeleccionadoId(id);
    setVistaActual('detalle');
  };

  const cambiarVista = (vista) => {
    setVistaActual(vista);
    if (vista === 'inicio' || vista === 'favoritos') {
      setProductoSeleccionadoId(null);
    }
  };

  return (
    <div className="app-container">
      <Cabecera 
        alCambiarVista={cambiarVista} 
        cantidadFavoritos={favoritos.length} 
      />
      
      <main className="main-content">
        {(vistaActual === 'inicio' || vistaActual === 'favoritos') && (
          <Inicio 
            alSeleccionarProducto={seleccionarProducto} 
            favoritos={favoritos}
            alAlternarFavorito={alternarFavorito}
            vistaFavoritos={vistaActual === 'favoritos'}
          />
        )}

        {vistaActual === 'detalle' && (
          <DetalleProducto 
            productoId={productoSeleccionadoId} 
            alVolver={() => cambiarVista('inicio')} 
            favoritos={favoritos}
            alAlternarFavorito={alternarFavorito}
          />
        )}

        {vistaActual === 'publicar' && (
          <Publicar />
        )}
      </main>

      <footer className="site-footer">
        ReUse · Tecnología que vuelve a funcionar.
      </footer>
    </div>
  );
}
