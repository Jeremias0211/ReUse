import React, { useState } from 'react';
import InsigniaEstado from '../componentes/InsigniaEstado';
import { api } from '../api';

const CATEGORIAS = ['Celulares', 'Notebooks', 'Consolas', 'Monitores', 'Auriculares', 'Periféricos', 'Otros'];
const CONDICIONES = ['Excelente', 'Muy bueno', 'Bueno', 'Aceptable'];

// Listado extendido de localidades, partidos del GBA, CABA y principales ciudades
const LOCALIDADES = [
  // GBA Sur
  { nombre: 'Lanús Este (GBA Sur)', ciudad: 'Lanús', zona: 'Lanús Este', lat: -34.7065, lng: -58.3882, radio: 800 },
  { nombre: 'Lanús Oeste (GBA Sur)', ciudad: 'Lanús', zona: 'Lanús Oeste', lat: -34.7150, lng: -58.3980, radio: 800 },
  { nombre: 'Lomas de Zamora Centro (GBA Sur)', ciudad: 'Lomas de Zamora', zona: 'Centro, Lomas', lat: -34.7578, lng: -58.4014, radio: 1000 },
  { nombre: 'Banfield (GBA Sur)', ciudad: 'Banfield', zona: 'Banfield Oeste', lat: -34.7351, lng: -58.4069, radio: 700 },
  { nombre: 'Temperley (GBA Sur)', ciudad: 'Lomas de Zamora', zona: 'Temperley', lat: -34.7765, lng: -58.3912, radio: 900 },
  { nombre: 'Adrogué - Almirante Brown (GBA Sur)', ciudad: 'Almirante Brown', zona: 'Adrogué', lat: -34.7972, lng: -58.3861, radio: 1000 },
  { nombre: 'Avellaneda Centro (GBA Sur)', ciudad: 'Avellaneda', zona: 'Avellaneda Centro', lat: -34.6627, lng: -58.3647, radio: 850 },
  { nombre: 'Wilde (GBA Sur)', ciudad: 'Avellaneda', zona: 'Wilde centro', lat: -34.7023, lng: -58.3364, radio: 900 },
  { nombre: 'Sarandí (GBA Sur)', ciudad: 'Avellaneda', zona: 'Sarandí', lat: -34.6812, lng: -58.3510, radio: 800 },
  { nombre: 'Quilmes Centro (GBA Sur)', ciudad: 'Quilmes', zona: 'Quilmes Centro', lat: -34.7226, lng: -58.2554, radio: 1000 },
  { nombre: 'Bernal (GBA Sur)', ciudad: 'Quilmes', zona: 'Bernal', lat: -34.7061, lng: -58.2814, radio: 900 },
  { nombre: 'Ezpeleta (GBA Sur)', ciudad: 'Quilmes', zona: 'Ezpeleta', lat: -34.7511, lng: -58.2392, radio: 900 },
  { nombre: 'Berazategui (GBA Sur)', ciudad: 'Berazategui', zona: 'Berazategui Centro', lat: -34.7633, lng: -58.2125, radio: 1000 },
  { nombre: 'Florencio Varela (GBA Sur)', ciudad: 'Florencio Varela', zona: 'Centro', lat: -34.8144, lng: -58.2747, radio: 1200 },
  { nombre: 'Monte Grande - Esteban Echeverría (GBA Sur)', ciudad: 'Esteban Echeverría', zona: 'Monte Grande', lat: -34.8175, lng: -58.4719, radio: 1000 },
  { nombre: 'Ezeiza (GBA Sur)', ciudad: 'Ezeiza', zona: 'Centro', lat: -34.5042, lng: -58.5208, radio: 1200 },

  // GBA Oeste
  { nombre: 'San Justo - La Matanza (GBA Oeste)', ciudad: 'La Matanza', zona: 'San Justo', lat: -34.6800, lng: -58.5600, radio: 1000 },
  { nombre: 'Ramos Mejía - La Matanza (GBA Oeste)', ciudad: 'La Matanza', zona: 'Ramos Mejía', lat: -34.6461, lng: -58.5622, radio: 900 },
  { nombre: 'Lomas del Mirador (GBA Oeste)', ciudad: 'La Matanza', zona: 'Lomas del Mirador', lat: -34.6469, lng: -58.5239, radio: 800 },
  { nombre: 'Haedo - Morón (GBA Oeste)', ciudad: 'Morón', zona: 'Haedo', lat: -34.6464, lng: -58.6183, radio: 900 },
  { nombre: 'Morón Centro (GBA Oeste)', ciudad: 'Morón', zona: 'Morón Centro', lat: -34.5503, lng: -58.6167, radio: 1000 },
  { nombre: 'Castelar (GBA Oeste)', ciudad: 'Morón', zona: 'Castelar', lat: -34.6569, lng: -58.6478, radio: 900 },
  { nombre: 'Ituzaingó (GBA Oeste)', ciudad: 'Ituzaingó', zona: 'Centro', lat: -34.6583, lng: -58.6694, radio: 1000 },
  { nombre: 'Merlo (GBA Oeste)', ciudad: 'Merlo', zona: 'Centro', lat: -34.6642, lng: -58.7292, radio: 1200 },
  { nombre: 'Moreno (GBA Oeste)', ciudad: 'Moreno', zona: 'Centro', lat: -34.6531, lng: -58.7903, radio: 1200 },

  // GBA Norte
  { nombre: 'Vicente López (GBA Norte)', ciudad: 'Vicente López', zona: 'Vicente López', lat: -34.5228, lng: -58.4758, radio: 800 },
  { nombre: 'Olivos (GBA Norte)', ciudad: 'Vicente López', zona: 'Olivos', lat: -34.5119, lng: -58.4831, radio: 800 },
  { nombre: 'Florida (GBA Norte)', ciudad: 'Vicente López', zona: 'Florida', lat: -34.5358, lng: -58.4914, radio: 800 },
  { nombre: 'San Isidro Centro (GBA Norte)', ciudad: 'San Isidro', zona: 'San Isidro Centro', lat: -34.4700, lng: -58.5270, radio: 1000 },
  { nombre: 'Martínez (GBA Norte)', ciudad: 'San Isidro', zona: 'Martínez', lat: -34.5028, lng: -58.5131, radio: 900 },
  { nombre: 'San Fernando (GBA Norte)', ciudad: 'San Fernando', zona: 'Centro', lat: -34.4458, lng: -58.5583, radio: 1000 },
  { nombre: 'Tigre Centro (GBA Norte)', ciudad: 'Tigre', zona: 'Tigre Centro', lat: -34.4258, lng: -58.5796, radio: 1100 },
  { nombre: 'Pilar (GBA Norte)', ciudad: 'Pilar', zona: 'Centro', lat: -34.4589, lng: -58.9142, radio: 1500 },

  // CABA (Capital Federal)
  { nombre: 'Capital Federal - Palermo (CABA)', ciudad: 'Capital Federal', zona: 'Palermo', lat: -34.5889, lng: -58.4300, radio: 1000 },
  { nombre: 'Capital Federal - Caballito (CABA)', ciudad: 'Capital Federal', zona: 'Caballito', lat: -34.6180, lng: -58.4400, radio: 1000 },
  { nombre: 'Capital Federal - Belgrano (CABA)', ciudad: 'Capital Federal', zona: 'Belgrano', lat: -34.5627, lng: -58.4560, radio: 1000 },
  { nombre: 'Capital Federal - Recoleta (CABA)', ciudad: 'Capital Federal', zona: 'Recoleta', lat: -34.5875, lng: -58.3975, radio: 900 },
  { nombre: 'Capital Federal - Almagro (CABA)', ciudad: 'Capital Federal', zona: 'Almagro', lat: -34.6097, lng: -58.4231, radio: 900 },
  { nombre: 'Capital Federal - Villa Crespo (CABA)', ciudad: 'Capital Federal', zona: 'Villa Crespo', lat: -34.5983, lng: -58.4389, radio: 900 },
  { nombre: 'Capital Federal - Flores (CABA)', ciudad: 'Capital Federal', zona: 'Flores', lat: -34.6292, lng: -58.4631, radio: 1000 },
  { nombre: 'Capital Federal - Saavedra (CABA)', ciudad: 'Capital Federal', zona: 'Saavedra', lat: -34.5550, lng: -58.4850, radio: 900 },
  { nombre: 'Capital Federal - Centro / Microcentro (CABA)', ciudad: 'Capital Federal', zona: 'San Nicolás / Centro', lat: -34.6037, lng: -58.3816, radio: 1000 },

  // La Plata y alrededores
  { nombre: 'La Plata Centro', ciudad: 'La Plata', zona: 'La Plata Centro', lat: -34.9214, lng: -57.9544, radio: 1200 },
  { nombre: 'City Bell', ciudad: 'La Plata', zona: 'City Bell', lat: -34.8711, lng: -58.0436, radio: 1000 },

  // Principales Ciudades del Interior
  { nombre: 'Mar del Plata (Buenos Aires)', ciudad: 'General Pueyrredón', zona: 'Mar del Plata Centro', lat: -38.0055, lng: -57.5426, radio: 1500 },
  { nombre: 'Bahía Blanca (Buenos Aires)', ciudad: 'Bahía Blanca', zona: 'Centro', lat: -38.7196, lng: -62.2724, radio: 1500 },
  { nombre: 'Rosario (Santa Fe)', ciudad: 'Rosario', zona: 'Rosario Centro', lat: -32.9468, lng: -60.6393, radio: 1500 },
  { nombre: 'Córdoba Capital', ciudad: 'Córdoba', zona: 'Nueva Córdoba / Centro', lat: -31.4201, lng: -64.1888, radio: 1500 },
  { nombre: 'Mendoza Capital', ciudad: 'Mendoza', zona: 'Centro', lat: -32.8895, lng: -68.8458, radio: 1200 },
  { nombre: 'San Miguel de Tucumán', ciudad: 'Tucumán', zona: 'Centro', lat: -26.8083, lng: -65.2176, radio: 1200 },
  { nombre: 'Salta Capital', ciudad: 'Salta', zona: 'Centro', lat: -24.7821, lng: -65.4232, radio: 1200 }
];

export default function Publicar({ session, alIniciarSesion, alPublicar }) {
  const [datosFormulario, setDatosFormulario] = useState({
    titulo: '',
    categoria: 'Celulares',
    precio: '',
    condicion: 'Excelente',
    localidadIndex: '0',
    descripcion: ''
  });

  const [fotos, setFotos] = useState([]); // Fotos en formato de datos para guardarlas junto al producto
  const [fotoActivaIndex, setFotoActivaIndex] = useState(0); // Índice de la foto que se muestra grande en la vista previa
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarSeleccionFotos = async (e) => {
    const archivos = Array.from(e.target.files).slice(0, 5);
    if (archivos.some((archivo) => archivo.size > 1_000_000)) {
      setError('Cada foto debe pesar menos de 1 MB para poder guardarla.');
      e.target.value = '';
      return;
    }
    try {
      const fotosData = await Promise.all(archivos.map((archivo) => new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
      })));
      setFotos(fotosData);
      setFotoActivaIndex(0);
      setError('');
    } catch {
      setError('No se pudieron leer las fotos seleccionadas.');
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setExito(false);

    if (!session?.token) {
      alIniciarSesion?.();
      return;
    }

    if (!datosFormulario.titulo.trim() || !datosFormulario.precio) {
      setError('Por favor completá el Título y el Precio del producto.');
      return;
    }

    if (Number(datosFormulario.precio) <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }

    setGuardando(true);
    try {
      await api('/api/productos', {
        method: 'POST',
        token: session.token,
        body: JSON.stringify({
          ...datosFormulario,
          precio: Number(datosFormulario.precio),
          fotos,
          ubicacion: {
            ciudad: localidadSeleccionada.ciudad,
            zona: localidadSeleccionada.zona,
            lat: localidadSeleccionada.lat,
            lng: localidadSeleccionada.lng,
            radioMetros: localidadSeleccionada.radio
          }
        })
      });
      setExito(true);
      setDatosFormulario({ titulo: '', categoria: 'Celulares', precio: '', condicion: 'Excelente', localidadIndex: '0', descripcion: '' });
      setFotos([]);
      setFotoActivaIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const localidadSeleccionada = LOCALIDADES[Number(datosFormulario.localidadIndex)] || LOCALIDADES[0];

  const formatearPrecio = (precio) => {
    if (!precio || isNaN(precio)) return '$ 0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--petroleo)', marginBottom: '8px' }}>
        Publicar producto tecnológico
      </h1>
      <p style={{ color: '#64748B', marginBottom: '24px', fontSize: '1rem' }}>
        Completá el formulario, subí tus fotos (puedes agregar varias) y previsualizá en tiempo real cómo quedará tu publicación.
      </p>

      {exito && (
        <div className="success-banner" style={{ marginBottom: '20px' }}>
          ¡Listo! La publicación quedó guardada y seguirá disponible aunque cierres sesión. <button type="button" className="text-button" onClick={alPublicar}>Ver catálogo</button>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#EF4444', borderRadius: '8px', border: '1px solid #F87171', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }} className="publish-grid-container">
        
        {/* FORMULARIO */}
        <div className="form-container" style={{ margin: 0, maxWidth: 'none' }}>
          <form onSubmit={manejarEnvio}>
            <div className="form-group">
              <label className="form-label" htmlFor="titulo">Título del producto *</label>
              <input 
                type="text" 
                id="titulo"
                name="titulo" 
                className="form-input" 
                placeholder="Ej: iPhone 11 64GB - Excelente estado"
                value={datosFormulario.titulo}
                onChange={manejarCambio}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-responsive">
              <div className="form-group">
                <label className="form-label" htmlFor="categoria">Categoría</label>
                <select 
                  id="categoria"
                  name="categoria" 
                  className="form-select"
                  value={datosFormulario.categoria}
                  onChange={manejarCambio}
                >
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="precio">Precio en ARS ($) *</label>
                <input 
                  type="number" 
                  id="precio"
                  name="precio" 
                  className="form-input" 
                  placeholder="Ej: 350000"
                  value={datosFormulario.precio}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-responsive">
              <div className="form-group">
                <label className="form-label" htmlFor="condicion">Estado</label>
                <select 
                  id="condicion"
                  name="condicion" 
                  className="form-select"
                  value={datosFormulario.condicion}
                  onChange={manejarCambio}
                >
                  {CONDICIONES.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="localidadIndex">Localidad / Zona</label>
                <select 
                  id="localidadIndex"
                  name="localidadIndex" 
                  className="form-select"
                  value={datosFormulario.localidadIndex}
                  onChange={manejarCambio}
                >
                  {LOCALIDADES.map((loc, idx) => (
                    <option key={idx} value={String(idx)}>{loc.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="descripcion">Descripción</label>
              <textarea 
                id="descripcion"
                name="descripcion" 
                className="form-textarea" 
                rows="4"
                placeholder="Detallá el funcionamiento, accesorios incluidos, detalles estéticos..."
                value={datosFormulario.descripcion}
                onChange={manejarCambio}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Fotos del producto (hasta 5 imágenes de 1 MB cada una)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                disabled={guardando}
                onChange={manejarSeleccionFotos}
                style={{ display: 'block', width: '100%', padding: '10px', background: '#FAFAFA', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer' }}
              />
              {fotos.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--esmeralda)', fontWeight: '600', marginBottom: '8px' }}>
                    ✓ {fotos.length} {fotos.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}:
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {fotos.map((foto, index) => (
                      <div 
                        key={index} 
                        onClick={() => setFotoActivaIndex(index)}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '6px', 
                          overflow: 'hidden', 
                          border: fotoActivaIndex === index ? '2px solid var(--esmeralda)' : '2px solid #CBD5E1',
                          cursor: 'pointer',
                          backgroundImage: `url(${foto})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        title={`Foto ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="form-submit-btn" disabled={guardando}>
              {guardando ? 'Guardando publicación…' : 'Publicar producto'}
            </button>
          </form>
        </div>

        {/* VENTANA DE VISTA PREVIA EN TIEMPO REAL CON MÚLTIPLES FOTOS */}
        <div>
          <div style={{ position: 'sticky', top: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--petroleo)', marginBottom: '12px' }}>
              👁️ Vista previa de tu publicación
            </h3>
            
            <div className="product-card" style={{ pointerEvents: 'none' }}>
              <div 
                className="product-card-img" 
                style={{ 
                  backgroundImage: fotos.length > 0 ? `url(${fotos[fotoActivaIndex] || fotos[0]})` : 'none', 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                {fotos.length === 0 && 'Foto'}
                {fotos.length > 1 && (
                  <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {fotoActivaIndex + 1} / {fotos.length}
                  </span>
                )}
              </div>
              <div className="product-card-body">
                <div className="product-card-header-row">
                  <span className="product-price">
                    {formatearPrecio(datosFormulario.precio)}
                  </span>
                  <InsigniaEstado condicion={datosFormulario.condicion} />
                </div>
                <h3 className="product-title">
                  {datosFormulario.titulo || 'Título de tu producto aparecerá aquí...'}
                </h3>
                <div className="product-location">
                  <span>📍</span>
                  <span>{localidadSeleccionada.ciudad}, {localidadSeleccionada.zona}</span>
                </div>
              </div>
            </div>

            {fotos.length > 1 && (
              <p style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', marginTop: '8px' }}>
                Hacé clic en las miniaturas del formulario para ver las demás fotos en la vista previa.
              </p>
            )}

            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--blanco)', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.9rem', color: '#4B5563' }}>
              <p style={{ fontWeight: '600', color: 'var(--petroleo)', marginBottom: '4px' }}>ℹ️ Información:</p>
              <p>Las imágenes se guardan con la publicación y aparecen en el catálogo. La ubicación solo muestra una zona aproximada.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Estilos responsive para la grilla de publicación */}
      <style>{`
        @media (max-width: 850px) {
          .publish-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
