import React from 'react';
import { precioARS } from '../api';

export default function DetalleCompra({ compra, alInicio, alVerCompras }) {
  if (!compra) return <div className="empty-state"><h2>No hay una compra seleccionada.</h2><button className="form-submit-btn compact-button" onClick={alInicio}>Volver al inicio</button></div>;
  const fecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(compra.fecha));
  return <section className="receipt-wrap">
    <div className="receipt-success"><div className="success-check">✓</div><p className="eyebrow">PAGO SIMULADO APROBADO</p><h1>¡Gracias por tu compra!</h1><p>Tu pedido quedó registrado. Acá tenés el detalle para consultarlo cuando quieras.</p></div>
    <article className="receipt-card">
      <div className="receipt-top"><div><span className="eyebrow">COMPROBANTE REUSE</span><h2>{compra.referencia}</h2></div><span className="receipt-status">● {compra.estado}</span></div>
      <div className="receipt-meta"><div><span>Fecha</span><strong>{fecha}</strong></div><div><span>Comprador</span><strong>{compra.comprador?.nombre}</strong></div><div><span>Medio de pago</span><strong>{compra.metodo}</strong></div><div><span>Tarjeta</span><strong>•••• {compra.tarjetaUltimos4}</strong></div></div>
      <div className="receipt-items"><h3>Productos</h3>{compra.productos?.map((producto) => <div className="receipt-item" key={producto.id}><div className="receipt-product-image">{producto.foto ? <img src={producto.foto} alt="" /> : 'R'}</div><div className="receipt-item-copy"><strong>{producto.titulo}</strong><span>{producto.categoria}</span></div><strong>{precioARS(producto.precio)}</strong></div>)}</div>
      <div className="receipt-total"><span>Total abonado</span><strong>{precioARS(compra.total)}</strong></div>
      <p className="secure-note receipt-note">Este comprobante corresponde a una operación de demostración. No se realizó ningún cobro real.</p>
    </article>
    <div className="receipt-actions"><button className="form-submit-btn compact-button" onClick={alInicio}>Volver al inicio</button><button className="outline-button" onClick={alVerCompras}>Ver mis compras</button></div>
  </section>;
}
