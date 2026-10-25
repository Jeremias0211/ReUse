import React, { useEffect, useState } from 'react';
import Cabecera from './componentes/Cabecera';
import Inicio from './paginas/Inicio';
import PortadaPublica from './paginas/PortadaPublica';
import DetalleProducto from './paginas/DetalleProducto';
import Publicar from './paginas/Publicar';
import Acceso from './paginas/Acceso';
import Carrito from './paginas/Carrito';
import Pago from './paginas/Pago';
import DetalleCompra from './paginas/DetalleCompra';
import HistorialCompras from './paginas/HistorialCompras';
import AdminPanel from './paginas/AdminPanel';
import { api } from './api';

function leerJSON(clave, valorInicial) {
  try { const guardado = localStorage.getItem(clave); return guardado ? JSON.parse(guardado) : valorInicial; }
  catch { return valorInicial; }
}

export default function App() {
  const [vistaActual, setVistaActual] = useState(() => window.location.pathname === '/admin' ? 'admin' : 'inicio');
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [vistaPendiente, setVistaPendiente] = useState(null);
  const [session, setSession] = useState(() => leerJSON('reuse_sesion', null));
  const [sessionReady, setSessionReady] = useState(() => !session?.token);
  const [favoritos, setFavoritos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [modoAcceso, setModoAcceso] = useState('ingresar');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    let activo = true;
    if (!session?.token) {
      setSessionReady(true);
      return () => { activo = false; };
    }
    setSessionReady(false);
    api('/api/auth/me', { token: session.token })
      .then(({ usuario }) => {
        if (activo) setSession((actual) => actual?.token === session.token ? { ...actual, usuario } : actual);
      })
      .catch(() => {
        if (!activo) return;
        localStorage.removeItem('reuse_sesion');
        setSession((actual) => actual?.token === session.token ? null : actual);
      })
      .finally(() => { if (activo) setSessionReady(true); });
    return () => { activo = false; };
  }, [session?.token]);

  useEffect(() => {
    const seguirRuta = () => setVistaActual(window.location.pathname === '/admin' ? 'admin' : 'inicio');
    window.addEventListener('popstate', seguirRuta);
    return () => window.removeEventListener('popstate', seguirRuta);
  }, []);

  useEffect(() => {
    const usuarioId = session?.usuario?.id;
    if (!usuarioId) {
      setFavoritos([]);
      setCarrito([]);
      return;
    }
    setFavoritos(leerJSON(`reuse_favoritos_${usuarioId}`, []));
    setCarrito(leerJSON(`reuse_carrito_${usuarioId}`, []));
  }, [session?.usuario?.id]);

  useEffect(() => {
    const usuarioId = session?.usuario?.id;
    if (usuarioId) localStorage.setItem(`reuse_favoritos_${usuarioId}`, JSON.stringify(favoritos));
  }, [favoritos, session?.usuario?.id]);
  useEffect(() => {
    const usuarioId = session?.usuario?.id;
    if (usuarioId) localStorage.setItem(`reuse_carrito_${usuarioId}`, JSON.stringify(carrito));
  }, [carrito, session?.usuario?.id]);
  useEffect(() => { if (aviso) { const id = setTimeout(() => setAviso(''), 2800); return () => clearTimeout(id); } }, [aviso]);

  const cambiarVista = (vista) => {
    if (vista === 'registro' || vista === 'acceso') {
      setModoAcceso(vista === 'registro' ? 'registro' : 'ingresar');
      setVistaActual('acceso');
      return;
    }
    if (!session?.usuario && vista !== 'inicio' && vista !== 'admin') {
      setVistaPendiente(vista);
      setModoAcceso('registro');
      setVistaActual('acceso');
      return;
    }
    if (vista === 'admin') {
      window.history.pushState({}, '', '/admin');
      setVistaActual('admin');
      return;
    }
    if (window.location.pathname === '/admin') window.history.replaceState({}, '', '/');
    setVistaActual(vista);
    if (vista === 'inicio' || vista === 'favoritos') setProductoSeleccionadoId(null);
  };

  const autenticar = (sesion) => {
    localStorage.setItem('reuse_sesion', JSON.stringify(sesion));
    setSession(sesion);
    setSessionReady(true);
    const destino = vistaPendiente || (vistaActual === 'admin' ? 'admin' : 'inicio');
    setVistaPendiente(null);
    setVistaActual(destino);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('reuse_sesion');
    setSession(null);
    setVistaPendiente(null);
    setVistaActual(vistaActual === 'admin' ? 'admin' : 'inicio');
  };

  const seleccionarProducto = (id) => { setProductoSeleccionadoId(id); setVistaActual('detalle'); };
  const alternarFavorito = (id) => setFavoritos((prev) => prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]);
  const agregarAlCarrito = (id) => {
    setCarrito((prev) => prev.includes(id) ? prev : [...prev, id]);
    setAviso(carrito.includes(id) ? 'Ese producto ya está en tu carrito.' : 'Producto agregado al carrito.');
  };
  const completarCompra = (compra) => {
    setCompraSeleccionada(compra);
    setCarrito([]);
    setVistaActual('compra');
  };

  if (!sessionReady) return <div className="app-container"><main className="main-content"><div className="loading-state">Verificando tu sesión…</div></main></div>;

  if (vistaActual === 'admin') {
    if (session?.usuario?.role === 'admin') return <AdminPanel token={session.token} usuario={session.usuario} alCerrarSesion={cerrarSesion} alInicio={() => cambiarVista('inicio')} />;
    return <div className="app-container"><main className="main-content"><Acceso soloAdmin alAutenticar={autenticar} alVolver={() => cambiarVista('inicio')} /></main></div>;
  }

  if (!session?.usuario) return <div className="app-container">
    <Cabecera alCambiarVista={cambiarVista} usuario={null} />
    <main className="main-content">
      {vistaActual === 'acceso'
        ? <Acceso modoInicial={modoAcceso} alAutenticar={autenticar} alVolver={() => { setVistaActual('inicio'); setVistaPendiente(null); }} />
        : <PortadaPublica alCrearCuenta={() => cambiarVista('registro')} alIniciarSesion={() => cambiarVista('acceso')} />}
    </main>
    <footer className="site-footer">ReUse · Tecnología que vuelve a funcionar.</footer>
  </div>;

  return (
    <div className="app-container">
      <Cabecera alCambiarVista={cambiarVista} cantidadFavoritos={favoritos.length} cantidadCarrito={carrito.length} usuario={session.usuario} alCerrarSesion={cerrarSesion} />
      <main className="main-content">
        {vistaActual === 'inicio' && <Inicio token={session.token} alSeleccionarProducto={seleccionarProducto} favoritos={favoritos} alAlternarFavorito={alternarFavorito} alAgregarCarrito={agregarAlCarrito} />}
        {vistaActual === 'favoritos' && <Inicio token={session.token} alSeleccionarProducto={seleccionarProducto} favoritos={favoritos} alAlternarFavorito={alternarFavorito} vistaFavoritos alAgregarCarrito={agregarAlCarrito} />}
        {vistaActual === 'detalle' && <DetalleProducto token={session.token} productoId={productoSeleccionadoId} alVolver={() => cambiarVista('inicio')} favoritos={favoritos} alAlternarFavorito={alternarFavorito} alAgregarCarrito={agregarAlCarrito} />}
        {vistaActual === 'publicar' && <Publicar session={session} alIniciarSesion={() => { setVistaPendiente('publicar'); setVistaActual('acceso'); }} alPublicar={() => cambiarVista('inicio')} />}
        {vistaActual === 'acceso' && <Acceso alAutenticar={autenticar} alVolver={() => { setVistaActual('inicio'); setVistaPendiente(null); }} />}
        {vistaActual === 'carrito' && <Carrito ids={carrito} token={session.token} alQuitar={(id) => setCarrito((prev) => prev.filter((item) => item !== id))} alCheckout={() => cambiarVista('pagar')} alVolver={() => cambiarVista('inicio')} />}
        {vistaActual === 'pagar' && <Pago ids={carrito} token={session.token} alCompletar={completarCompra} alVolver={() => cambiarVista('carrito')} />}
        {vistaActual === 'compra' && <DetalleCompra compra={compraSeleccionada} alInicio={() => cambiarVista('inicio')} alVerCompras={() => cambiarVista('compras')} />}
        {vistaActual === 'compras' && <HistorialCompras token={session.token} alSeleccionar={(compra) => { setCompraSeleccionada(compra); setVistaActual('compra'); }} alVolver={() => cambiarVista('inicio')} />}
      </main>
      <footer className="site-footer">ReUse · Tecnología que vuelve a funcionar.</footer>
      {aviso && <div className="toast-message" role="status">✓ {aviso}</div>}
    </div>
  );
}
