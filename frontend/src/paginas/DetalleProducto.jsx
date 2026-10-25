import React, { useState, useEffect } from 'react';
import InsigniaEstado from '../componentes/InsigniaEstado';
import ListaRevision from '../componentes/ListaRevision';
import MapaUbicacion from '../componentes/MapaUbicacion';
import { api } from '../api';

export default function DetalleProducto({ token, productoId, alVolver, favoritos, alAlternarFavorito, alAgregarCarrito }) {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el simulador de chat
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { remitente: 'vendedor', texto: '¡Hola! Gracias por consultar por mi producto. ¿Tenés alguna duda sobre su estado o la revisión técnica?' }
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  useEffect(() => {
    setCargando(true);
    api(`/api/productos/${productoId}`, { token })
      .then(data => {
        setProducto(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, [productoId, token]);

  if (cargando) return <div className="loading-state">Cargando detalle...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!producto) return null;

  const esFavorito = favoritos.includes(producto.id);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(precio);
  };

  const enviarMensajeChat = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const mensajeUsuario = { remitente: 'usuario', texto: nuevoMensaje };
    setMensajes(prev => [...prev, mensajeUsuario]);
    setNuevoMensaje('');

    // Simular respuesta automática del vendedor tras 1 segundo
    setTimeout(() => {
      let respuestaAutomatica = "¡Hola! Sí, el producto está disponible. Podemos coordinar punto de encuentro en la zona.";
      const textoLower = nuevoMensaje.toLowerCase();
      if (textoLower.includes('precio') || textoLower.includes('rebaja')) {
        respuestaAutomatica = "El precio es el publicado, ya está ajustado por el estado que tiene.";
      } else if (textoLower.includes('permuta') || textoLower.includes('cambio')) {
        respuestaAutomatica = "Hola, por el momento solo venta en efectivo o transferencia, gracias por consultar.";
      } else if (textoLower.includes('batería') || textoLower.includes('pantalla')) {
        respuestaAutomatica = "Tal como indica la revisión técnica, está testeado y funcionando perfecto.";
      }

      setMensajes(prev => [...prev, { remitente: 'vendedor', texto: respuestaAutomatica }]);
    }, 1000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button 
          onClick={alVolver} 
          style={{ background: 'none', border: 'none', color: 'var(--esmeralda)', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', padding: 0 }}
        >
          ← Volver al listado
        </button>

        <button 
          onClick={() => alAlternarFavorito(producto.id)}
          style={{
            background: 'var(--blanco)',
            border: '1px solid #CBD5E1',
            borderRadius: '20px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
        >
          <span>{esFavorito ? '❤️ Guardado en favoritos' : '🤍 Guardar en favoritos'}</span>
        </button>
      </div>

      <div className="detail-container">
        <div className="detail-main">
          <div className="detail-img-placeholder">
            {producto.fotos?.[0] ? <img src={producto.fotos[0]} alt={producto.titulo} /> : <span>ReUse</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '600' }}>
                {producto.categoria}
              </span>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--petroleo)', marginTop: '4px' }}>
                {producto.titulo}
              </h1>
            </div>
            <InsigniaEstado condicion={producto.condicion} />
          </div>

          <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--esmeralda)', marginBottom: '24px' }}>
            {formatearPrecio(producto.precio)}
          </div>

          <button className="detail-add-cart" onClick={() => alAgregarCarrito(producto.id)}>＋ Agregar al carrito</button>

          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>Descripción</h3>
            <p style={{ color: '#4B5563', lineHeight: '1.6' }}>{producto.descripcion}</p>
          </div>

          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Revisión técnica ReUse</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
              Verificación realizada por el vendedor o técnico asociado.
            </p>
            <ListaRevision revision={producto.revision} />
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="detail-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '12px' }}>Ubicación aproximada y zona</h3>
            <MapaUbicacion ubicacion={producto.ubicacion} />
          </div>

          <div className="detail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--menta)', color: 'var(--petroleo)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {producto.vendedor.nombre.charAt(0)}
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Vendedor</span>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{producto.vendedor.nombre}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--esmeralda)', fontWeight: '600' }}>Miembro verificado</span>
              </div>
            </div>

            {/* Botón para abrir el chat simulado */}
            <button 
              onClick={() => setChatAbierto(!chatAbierto)}
              style={{
                width: '100%',
                backgroundColor: 'var(--esmeralda)',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              💬 {chatAbierto ? 'Ocultar chat' : 'Consultar con el vendedor'}
            </button>

            {/* Simulador de Chat */}
            {chatAbierto && (
              <div style={{ marginTop: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', background: '#FAFAFA' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--petroleo)', marginBottom: '8px', borderBottom: '1px solid #E5E7EB', paddingBottom: '6px' }}>
                  Chat con {producto.vendedor.nombre}
                </div>

                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px', paddingRight: '4px' }}>
                  {mensajes.map((msg, index) => (
                    <div 
                      key={index} 
                      style={{
                        alignSelf: msg.remitente === 'usuario' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.remitente === 'usuario' ? '#16A085' : '#E2E8F0',
                        color: msg.remitente === 'usuario' ? '#FFF' : '#1F2933',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        maxWidth: '85%',
                        fontSize: '0.85rem',
                        lineHeight: '1.4'
                      }}
                    >
                      {msg.texto}
                    </div>
                  ))}
                </div>

                <form onSubmit={enviarMensajeChat} style={{ display: 'flex', gap: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Escribí tu consulta..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                  <button 
                    type="submit" 
                    style={{ backgroundColor: 'var(--petroleo)', color: '#FFF', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
