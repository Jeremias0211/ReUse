import React, { useEffect, useState } from 'react';
import { api, precioARS } from '../api';

export default function HistorialCompras({ token, alSeleccionar, alVolver }) {
  const [compras, setCompras] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api('/api/compras', { token }).then(setCompras).catch((err) => setError(err.message)); }, [token]);
  return <section className="checkout-page"><button className="text-button" onClick={alVolver}>← Volver a ReUse</button><div className="page-heading"><div><p className="eyebrow">TU ACTIVIDAD</p><h1>Mis compras</h1><p className="muted">Tus pedidos guardados en tu cuenta.</p></div><span className="cart-count-large">{String(compras.length).padStart(2, '0')}</span></div>
    {error && <div className="form-error">{error}</div>}
    {!error && compras.length === 0 ? <div className="empty-state"><div className="empty-icon">↗</div><h2>Todavía no hiciste compras</h2><p>Cuando completes un pago simulado, vas a encontrar el comprobante acá.</p></div> : <div className="order-list">{compras.map((compra) => <button className="order-row" key={compra.id} onClick={() => alSeleccionar(compra)}><div className="order-icon">✓</div><div className="order-copy"><span className="eyebrow">{compra.referencia}</span><strong>{compra.productos.map((p) => p.titulo).join(' · ')}</strong><span>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(compra.fecha))} · {compra.productos.length} {compra.productos.length === 1 ? 'producto' : 'productos'}</span></div><strong className="order-total">{precioARS(compra.total)}</strong><span className="order-arrow">→</span></button>)}</div>}
  </section>;
}
