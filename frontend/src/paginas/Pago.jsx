import React, { useEffect, useMemo, useState } from 'react';
import { api, precioARS } from '../api';

export default function Pago({ ids, token, alCompletar, alVolver }) {
  const [productos, setProductos] = useState([]);
  const [titular, setTitular] = useState('');
  const [numero, setNumero] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  useEffect(() => { api('/api/productos', { token }).then(setProductos).catch((err) => setError(err.message)); }, [ids, token]);
  const seleccionados = useMemo(() => ids.map((id) => productos.find((p) => p.id === id)).filter(Boolean), [ids, productos]);
  const total = seleccionados.reduce((suma, p) => suma + p.precio, 0);
  const tarjetaLimpia = numero.replace(/\D/g, '');

  async function pagar(e) {
    e.preventDefault();
    setError('');
    if (!seleccionados.length || seleccionados.length !== ids.length) {
      setError('Un producto ya no está disponible. Volvé al carrito y actualizalo.');
      return;
    }
    if (tarjetaLimpia.length !== 16) { setError('La tarjeta de prueba debe tener 16 dígitos.'); return; }
    if (!/^\d{3,4}$/.test(cvv)) { setError('Ingresá un código de seguridad de 3 o 4 dígitos.'); return; }
    const fecha = vencimiento.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!fecha) { setError('Usá el formato de vencimiento MM/AA.'); return; }
    const mes = Number(fecha[1]);
    const anio = 2000 + Number(fecha[2]);
    const ahora = new Date();
    if (anio < ahora.getFullYear() || (anio === ahora.getFullYear() && mes < ahora.getMonth() + 1)) {
      setError('La tarjeta está vencida.'); return;
    }
    setCargando(true);
    try {
      const compra = await api('/api/compras', {
        method: 'POST', token,
        body: JSON.stringify({ productIds: ids, nombreTitular: titular.trim(), ultimosDigitos: tarjetaLimpia.slice(-4) })
      });
      alCompletar(compra);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="checkout-page">
      <button className="text-button" onClick={alVolver}>← Volver al carrito</button>
      <div className="page-heading"><div><p className="eyebrow">PAGO SEGURO · SIMULACIÓN</p><h1>Terminá tu compra</h1><p className="muted">Completá los datos de una tarjeta de prueba para generar el comprobante.</p></div><div className="payment-lock">⌑</div></div>
      <div className="payment-layout">
        <form className="payment-form" onSubmit={pagar}>
          <div className="payment-form-title"><div><span className="step-number">01</span><h2>Datos de la tarjeta</h2></div><span className="accepted-cards">VISA · Mastercard · AMEX</span></div>
          <label className="form-group"><span className="form-label">Nombre que figura en la tarjeta</span><input className="form-input" autoComplete="cc-name" required value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Como aparece en la tarjeta" /></label>
          <label className="form-group"><span className="form-label">Número de tarjeta</span><input className="form-input card-number-input" inputMode="numeric" autoComplete="cc-number" required value={numero} onChange={(e) => setNumero(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))} placeholder="0000 0000 0000 0000" /></label>
          <div className="form-row-responsive card-fields-row">
            <label className="form-group"><span className="form-label">Vencimiento</span><input className="form-input" inputMode="numeric" autoComplete="cc-exp" required value={vencimiento} onChange={(e) => { const limpio = e.target.value.replace(/\D/g, '').slice(0, 4); setVencimiento(limpio.length > 2 ? `${limpio.slice(0, 2)}/${limpio.slice(2)}` : limpio); }} placeholder="MM/AA" /></label>
            <label className="form-group"><span className="form-label">Código de seguridad</span><input className="form-input" inputMode="numeric" autoComplete="cc-csc" type="password" required value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="CVV" /></label>
          </div>
          {error && <div className="form-error auth-error" role="alert">{error}</div>}
          <button className="form-submit-btn payment-submit" disabled={cargando}>{cargando ? 'Procesando simulación…' : <>Confirmar pago de {precioARS(total)} <span>→</span></>}</button>
          <p className="secure-note">🔒 Simulación educativa: no se efectúa un cobro ni se guardan el número completo o el código de seguridad.</p>
        </form>
        <aside className="summary-card payment-summary"><p className="eyebrow">TU PEDIDO</p><h2>{seleccionados.length} {seleccionados.length === 1 ? 'producto' : 'productos'}</h2>
          {seleccionados.map((producto) => <div className="summary-product" key={producto.id}><span>{producto.titulo}</span><strong>{precioARS(producto.precio)}</strong></div>)}
          {!seleccionados.length && <p className="muted">Cargando productos…</p>}
          <div className="summary-total"><span>Total a pagar</span><strong>{precioARS(total)}</strong></div>
          <div className="simulation-stamp"><span>DEMO</span><p>Usá 4242 4242 4242 4242, un vencimiento futuro y cualquier CVV de 3 dígitos. No se realizará ningún cobro.</p></div>
        </aside>
      </div>
    </section>
  );
}
