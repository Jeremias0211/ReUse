import React, { useEffect, useState } from 'react';
import { api, precioARS } from '../api';

export default function Carrito({ ids, token, alQuitar, alCheckout, alVolver }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api('/api/productos', { token }).then(setProductos).catch((err) => setError(err.message));
  }, [ids, token]);
  const enCarrito = ids.map((id) => productos.find((producto) => producto.id === id)).filter(Boolean);
  const idsNoDisponibles = ids.filter((id) => !productos.some((producto) => producto.id === id));
  const noDisponibles = idsNoDisponibles.length;
  const total = enCarrito.reduce((suma, producto) => suma + producto.precio, 0);

  return (
    <section className="checkout-page">
      <button className="text-button" onClick={alVolver}>← Seguir mirando</button>
      <div className="page-heading"><div><p className="eyebrow">TU SELECCIÓN</p><h1>Carrito</h1><p className="muted">{enCarrito.length} {enCarrito.length === 1 ? 'producto' : 'productos'} listos para una nueva vida.</p></div><span className="cart-count-large">{enCarrito.length.toString().padStart(2, '0')}</span></div>
      {error && <div className="form-error">{error}</div>}
      {noDisponibles > 0 && <div className="inline-notice">{noDisponibles} producto(s) ya no están disponibles y no se incluirán en el total. <button onClick={() => idsNoDisponibles.forEach(alQuitar)}>Quitar del carrito</button></div>}
      {!enCarrito.length ? <div className="empty-state"><div className="empty-icon">⌑</div><h2>Tu carrito está esperando</h2><p>Cuando encuentres algo que te guste, guardalo acá.</p><button className="form-submit-btn compact-button" onClick={alVolver}>Explorar productos</button></div> : (
        <div className="cart-layout">
          <div className="cart-items">
            {enCarrito.map((producto) => <article className="cart-item" key={producto.id}>
              <div className="cart-thumb">{producto.fotos?.[0] ? <img src={producto.fotos[0]} alt="" /> : <span>ReUse</span>}</div>
              <div className="cart-item-copy"><span className="eyebrow">{producto.categoria}</span><h3>{producto.titulo}</h3><p>{producto.condicion} · {producto.ubicacion?.ciudad}</p></div>
              <strong>{precioARS(producto.precio)}</strong>
              <button className="remove-button" aria-label={`Quitar ${producto.titulo}`} onClick={() => alQuitar(producto.id)}>×</button>
            </article>)}
          </div>
          <aside className="summary-card">
            <p className="eyebrow">RESUMEN</p><h2>Tu compra</h2>
            <div className="summary-line"><span>Productos ({enCarrito.length})</span><strong>{precioARS(total)}</strong></div>
            <div className="summary-line"><span>Envío</span><strong>A coordinar</strong></div>
            <div className="summary-total"><span>Total</span><strong>{precioARS(total)}</strong></div>
            <button className="form-submit-btn" onClick={alCheckout}>Continuar al pago <span>→</span></button>
            <p className="secure-note">🔒 Pago de demostración · No se realiza ningún cobro real.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
