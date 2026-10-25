import React, { useState } from 'react';

export default function Cabecera({ alCambiarVista, cantidadFavoritos, cantidadCarrito, usuario, alCerrarSesion }) {
  const [errorImagen, setErrorImagen] = useState(false);
  return <header className="site-header">
    <button onClick={() => alCambiarVista('inicio')} className="header-brand" aria-label="Ir al inicio de ReUse">
      {!errorImagen && <img src="/src/assets/logo.png" alt="" className="header-logo" onError={() => setErrorImagen(true)} />}
      <span className="header-title">ReUse<span className="brand-dot">.</span></span>
    </button>
    {usuario && <div className="header-search"><span className="search-icon">⌕</span><input type="text" placeholder="Buscar celulares, notebooks, consolas..." readOnly /></div>}
    <nav className="header-nav" aria-label="Navegación principal">
      {usuario ? <>
        <button className="nav-quiet favorites-nav" onClick={() => alCambiarVista('favoritos')}><span>♡</span> Favoritos{cantidadFavoritos > 0 && <i className="nav-badge">{cantidadFavoritos}</i>}</button>
        <button className="nav-quiet orders-nav" onClick={() => alCambiarVista('compras')}>Mis compras</button>
        <button className="cart-nav" onClick={() => alCambiarVista('carrito')} aria-label={`Carrito con ${cantidadCarrito} productos`}><span>▱</span><b>Carrito</b><i className="nav-badge cart-badge">{cantidadCarrito}</i></button>
        <span className="nav-divider" />
        <div className="user-nav"><span className="user-initial">{usuario.nombre?.slice(0, 1).toUpperCase()}</span><span className="user-name">{usuario.nombre?.split(' ')[0]}</span><button className="nav-quiet logout-nav" onClick={alCerrarSesion}>Salir</button></div>
        <button className="btn-vender" onClick={() => alCambiarVista('publicar')}>＋ <span>Publicar</span></button>
      </> : <>
        <button className="nav-quiet login-nav" onClick={() => alCambiarVista('acceso')}>Iniciar sesión</button>
        <button className="btn-vender" onClick={() => alCambiarVista('registro')}>Crear cuenta</button>
      </>}
    </nav>
  </header>;
}
