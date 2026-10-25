import React, { useEffect, useState } from 'react';
import { api, precioARS } from '../api';

const inicial = { titulo: '', categoria: 'Celulares', precio: '', condicion: 'Muy bueno', descripcion: '' };

export default function AdminPanel({ token, usuario, alCerrarSesion, alInicio }) {
  const [datos, setDatos] = useState(null);
  const [formulario, setFormulario] = useState(inicial);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  async function cargarDatos() {
    setCargando(true);
    try { setDatos(await api('/api/admin/datos', { token })); setError(''); }
    catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }
  useEffect(() => { cargarDatos(); }, [token]);

  async function crearProducto(e) {
    e.preventDefault(); setError(''); setMensaje('');
    try {
      await api('/api/productos', { token, method: 'POST', body: JSON.stringify({ ...formulario, ubicacion: { ciudad: 'A coordinar', zona: 'A coordinar', lat: -34.6037, lng: -58.3816, radioMetros: 1000 } }) });
      setFormulario(inicial); setMensaje('El producto quedó publicado en el catálogo.'); await cargarDatos();
    } catch (err) { setError(err.message); }
  }
  async function cambiarArchivo(producto) {
    try {
      await api(`/api/productos/${producto.id}`, { token, method: 'PATCH', body: JSON.stringify({ archivado: !producto.archivado }) });
      setMensaje(producto.archivado ? 'La publicación volvió al catálogo.' : 'La publicación se archivó y puede reactivarse desde el panel.');
      await cargarDatos();
    }
    catch (err) { setError(err.message); }
  }

  const disponibles = datos?.productos.filter((p) => p.disponible !== false).length || 0;
  const ordenes = datos?.compras || [];
  return <div className="admin-shell">
    <header className="admin-header"><button className="admin-brand" onClick={alInicio}><span>R</span> ReUse <i>ADMIN</i></button><div className="admin-who"><span className="admin-avatar">{usuario.nombre.slice(0, 1)}</span><span>{usuario.nombre}</span><button onClick={alCerrarSesion}>Cerrar sesión</button></div></header>
    <main className="admin-main"><div className="admin-welcome"><div><p className="eyebrow">PANEL PRIVADO</p><h1>Hola, {usuario.nombre}</h1><p>Gestioná el inventario y consultá las cuentas y compras de ReUse.</p></div><span className="admin-live"><i /> SISTEMA ACTIVO</span></div>
      {error && <div className="form-error admin-alert">{error}</div>}{mensaje && <div className="success-banner">{mensaje}</div>}
      {cargando ? <div className="loading-state">Cargando datos del panel…</div> : datos && <>
        <div className="admin-stats"><article><span>Productos disponibles</span><strong>{disponibles.toString().padStart(2, '0')}</strong><small>en catálogo</small></article><article><span>Compras registradas</span><strong>{ordenes.length.toString().padStart(2, '0')}</strong><small>pagos simulados</small></article><article><span>Usuarios</span><strong>{datos.usuarios.length.toString().padStart(2, '0')}</strong><small>cuentas creadas</small></article><article><span>Volumen simulado</span><strong>{precioARS(datos.totalVendido)}</strong><small>sin cobros reales</small></article></div>
        <section className="admin-section admin-users"><div className="admin-section-heading"><div><p className="eyebrow">CUENTAS</p><h2>Usuarios registrados</h2></div><span>{datos.usuarios.length} cuentas</span></div><p className="admin-password-note">Las contraseñas se guardan protegidas y no se pueden leer desde el panel.</p>
          {datos.usuarios.length ? <div className="admin-user-grid">{datos.usuarios.map((u) => <article className="admin-user-card" key={u.id}><div className="admin-user-heading"><span className="admin-avatar">{u.nombre.slice(0, 1).toUpperCase()}</span><div><strong>{u.nombre}</strong><span>{u.email}</span></div></div><div className="admin-user-metrics"><div><span>Compras</span><strong>{u.cantidadCompras}</strong></div><div><span>Total</span><strong>{precioARS(u.totalCompras)}</strong></div></div><small>Cuenta creada: {u.creadoEn ? new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(u.creadoEn)) : '—'}</small><div className="admin-user-orders"><b>Pedidos de esta cuenta</b>{ordenes.filter((o) => o.userId === u.id).map((o) => <span key={o.id}>{o.referencia}: {(o.productos || []).map((p) => p.titulo).join(', ')} · {precioARS(o.total)}</span>)}{!u.cantidadCompras && <span>Todavía no hizo compras.</span>}</div></article>)}</div> : <p className="muted">Todavía no hay cuentas registradas.</p>}
        </section>
        <section className="admin-section"><div className="admin-section-heading"><div><p className="eyebrow">INVENTARIO</p><h2>Productos</h2></div><span>{datos.productos.length} publicaciones</span></div>
          <div className="admin-product-table"><div className="admin-table-head"><span>PRODUCTO</span><span>CATEGORÍA</span><span>PRECIO</span><span>ESTADO</span><span></span></div>
            {datos.productos.map((p) => <div className="admin-table-row" key={p.id}><div className="admin-product-name">{p.fotos?.[0] ? <img src={p.fotos[0]} alt="" /> : <span>R</span>}<strong>{p.titulo}</strong></div><span>{p.categoria}</span><strong>{precioARS(p.precio)}</strong><span className={p.archivado || p.vendido ? 'status-sold' : 'status-available'}>{p.archivado ? 'Archivado' : p.vendido ? 'Vendido' : 'Disponible'}</span>{p.vendido ? <span className="sold-lock">—</span> : <button className="archive-button" title={p.archivado ? 'Reactivar publicación' : 'Archivar publicación'} onClick={() => cambiarArchivo(p)}>{p.archivado ? '↺' : '⌑'}</button>}</div>)}
          </div>
        </section>
        <div className="admin-lower-grid"><section className="admin-section admin-add-product"><div className="admin-section-heading"><div><p className="eyebrow">NUEVA PUBLICACIÓN</p><h2>Agregar producto</h2></div></div><form onSubmit={crearProducto}>
          <label className="form-group"><span className="form-label">Título</span><input className="form-input" required value={formulario.titulo} onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} /></label>
          <div className="form-row-responsive"><label className="form-group"><span className="form-label">Categoría</span><select className="form-select" value={formulario.categoria} onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}>{['Celulares', 'Notebooks', 'Consolas', 'Monitores', 'Auriculares', 'Periféricos', 'Otros'].map((c) => <option key={c}>{c}</option>)}</select></label><label className="form-group"><span className="form-label">Precio (ARS)</span><input className="form-input" type="number" min="1" required value={formulario.precio} onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })} /></label></div>
          <label className="form-group"><span className="form-label">Estado</span><select className="form-select" value={formulario.condicion} onChange={(e) => setFormulario({ ...formulario, condicion: e.target.value })}>{['Excelente', 'Muy bueno', 'Bueno', 'Aceptable'].map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="form-group"><span className="form-label">Descripción</span><textarea className="form-textarea" rows="3" value={formulario.descripcion} onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })} /></label><button className="form-submit-btn">Guardar producto</button>
        </form></section>
        <section className="admin-section admin-orders"><div className="admin-section-heading"><div><p className="eyebrow">ACTIVIDAD</p><h2>Compras registradas</h2></div><span>{ordenes.length} pedidos</span></div>{ordenes.length ? ordenes.map((o) => <div className="admin-order" key={o.id}><div><strong>{o.referencia} · {o.comprador.nombre}</strong><span>{o.comprador.email} · {new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(o.fecha))}</span><small>{o.productos.map((p) => p.titulo).join(', ')}</small></div><strong>{precioARS(o.total)}</strong></div>) : <p className="muted">Todavía no hay compras registradas.</p>}</section></div>
      </>}
      <footer className="admin-footer">ReUse · consola privada de administración</footer>
    </main>
  </div>;
}
