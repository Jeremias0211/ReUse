import React, { useState, useEffect } from 'react';
import BarraCategorias from '../componentes/BarraCategorias';
import TarjetaProducto from '../componentes/TarjetaProducto';

export default function Inicio({ alSeleccionarProducto, favoritos, alAlternarFavorito, vistaFavoritos }) {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [condicionFiltro, setCondicionFiltro] = useState('Todas');
  const [precioMaximo, setPrecioMaximo] = useState(1000000);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    const url = categoriaSeleccionada === 'Todas' 
      ? '/api/productos' 
      : `/api/productos?categoria=${encodeURIComponent(categoriaSeleccionada)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los productos');
        return res.json();
      })
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, [categoriaSeleccionada]);

  // Filtrar productos según vista (favoritos o todos), condición y precio máximo
  const productosFiltrados = productos.filter(prod => {
    if (vistaFavoritos && !favoritos.includes(prod.id)) return false;
    if (condicionFiltro !== 'Todas' && prod.condicion !== condicionFiltro) return false;
    if (prod.precio > precioMaximo) return false;
    return true;
  });

  return (
    <div>
      <section style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--petroleo)', marginBottom: '8px' }}>
          {vistaFavoritos ? '❤️ Mis productos favoritos' : 'Tecnología que vuelve a funcionar'}
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.05rem' }}>
          {vistaFavoritos 
            ? 'Dispositivos que guardaste para revisar más tarde.' 
            : 'Comprá y vendé dispositivos tecnológicos reacondicionados y usados con revisión técnica transparente en el Gran Buenos Aires.'}
        </p>
      </section>

      {!vistaFavoritos && (
        <>
          <BarraCategorias 
            categoriaSeleccionada={categoriaSeleccionada} 
            alSeleccionarCategoria={setCategoriaSeleccionada} 
          />

          {/* Filtros avanzados (Condición y Precio Máximo) */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', padding: '16px', backgroundColor: 'var(--blanco)', borderRadius: '12px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--carbon)' }}>
                Filtrar por Estado:
              </label>
              <select 
                value={condicionFiltro} 
                onChange={(e) => setCondicionFiltro(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FAFAFA' }}
              >
                <option value="Todas">Todas las condiciones</option>
                <option value="Excelente">Excelente</option>
                <option value="Muy bueno">Muy bueno</option>
                <option value="Bueno">Bueno</option>
                <option value="Aceptable">Aceptable</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--carbon)' }}>
                Precio máximo: $ {precioMaximo.toLocaleString('es-AR')}
              </label>
              <input 
                type="range" 
                min="20000" 
                max="1000000" 
                step="20000"
                value={precioMaximo}
                onChange={(e) => setPrecioMaximo(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--esmeralda)' }}
              />
            </div>
          </div>
        </>
      )}

      {cargando && <div className="loading-state">Cargando productos...</div>}
      {error && <div className="error-state">Error: {error}</div>}

      {!cargando && !error && productosFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B', background: 'var(--blanco)', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--petroleo)' }}>No se encontraron productos</h3>
          <p>Probá cambiando los filtros o la categoría seleccionada.</p>
        </div>
      )}

      {!cargando && !error && productosFiltrados.length > 0 && (
        <div className="products-grid">
          {productosFiltrados.map(producto => (
            <TarjetaProducto 
              key={producto.id} 
              producto={producto} 
              alHacerClick={alSeleccionarProducto}
              esFavorito={favoritos.includes(producto.id)}
              alAlternarFavorito={alAlternarFavorito}
            />
          ))}
        </div>
      )}
    </div>
  );
}
