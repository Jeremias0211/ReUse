import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function PortadaPublica({ alCrearCuenta, alIniciarSesion }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/productos/preview')
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return <section className="public-home">
    <div className="public-hero">
      <p className="eyebrow">TECNOLOGÍA QUE VUELVE A FUNCIONAR</p>
      <h1>Encontrá tu próximo dispositivo en ReUse.</h1>
      <p>Creá tu cuenta para explorar el catálogo completo, guardar favoritos, armar tu carrito y seguir tus compras.</p>
      <div className="public-hero-actions">
        <button className="form-submit-btn" onClick={alCrearCuenta}>Crear mi cuenta</button>
        <button className="text-button" onClick={alIniciarSesion}>Ya tengo cuenta</button>
      </div>
    </div>

    <div className="public-preview-heading">
      <div><p className="eyebrow">UNA PEQUEÑA MUESTRA</p><h2>Algunos productos disponibles</h2></div>
      <span>Registrate para ver todos</span>
    </div>
    {cargando && <div className="loading-state">Cargando muestra…</div>}
    {error && <div className="error-state" role="alert">{error}</div>}
    {!cargando && !error && productos.length === 0 && <p className="muted">Pronto vas a encontrar nuevos productos.</p>}
    {!cargando && !error && productos.length > 0 && <div className="public-preview-grid">
      {productos.map((producto) => <article className="public-preview-card" key={producto.id}>
        <div className="public-preview-image">
          {producto.foto ? <img src={producto.foto} alt="" /> : <span>ReUse</span>}
          <span className="public-preview-lock">Vista previa</span>
        </div>
        <div className="public-preview-copy">
          <span>{producto.categoria} · {producto.condicion}</span>
          <h3>{producto.titulo}</h3>
        </div>
      </article>)}
    </div>}
  </section>;
}
