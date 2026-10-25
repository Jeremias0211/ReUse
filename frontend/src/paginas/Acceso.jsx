import React, { useState } from 'react';
import { api } from '../api';

export default function Acceso({ alAutenticar, soloAdmin = false, alVolver, modoInicial = 'ingresar' }) {
  const [modo, setModo] = useState(modoInicial);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const resultado = await api(modo === 'registro' ? '/api/auth/registro' : '/api/auth/login', {
        method: 'POST', body: JSON.stringify({ nombre, email, password })
      });
      if (soloAdmin && resultado.usuario.role !== 'admin') {
        setError('Esta cuenta no tiene permisos de administrador.');
        return;
      }
      alAutenticar(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-mark">{soloAdmin ? 'R' : '↗'}</div>
        <p className="eyebrow">{soloAdmin ? 'ACCESO PRIVADO' : 'TU ESPACIO REUSE'}</p>
        <h1>{soloAdmin ? 'Panel de administración' : modo === 'registro' ? 'Creá tu cuenta' : 'Qué bueno verte'}</h1>
        <p className="muted">{soloAdmin ? 'Ingresá con una cuenta administradora para continuar.' : modo === 'registro' ? 'Publicá, guardá tus productos y seguí tus compras.' : 'Ingresá para comprar o publicar tecnología con otra vida.'}</p>

        <form onSubmit={enviar} className="auth-form">
          {modo === 'registro' && !soloAdmin && (
            <label className="form-group"><span className="form-label">Nombre</span><input className="form-input" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} required minLength={2} placeholder="Tu nombre" /></label>
          )}
          <label className="form-group"><span className="form-label">Email</span><input className="form-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vos@ejemplo.com" /></label>
          <label className="form-group"><span className="form-label">Contraseña</span><input className="form-input" type="password" autoComplete={modo === 'registro' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={modo === 'registro' ? 8 : 1} placeholder={modo === 'registro' ? 'Al menos 8 caracteres' : 'Tu contraseña'} /></label>
          {error && <div className="form-error auth-error" role="alert">{error}</div>}
          <button className="form-submit-btn" disabled={cargando}>{cargando ? 'Un momento…' : soloAdmin ? 'Ingresar al panel' : modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}</button>
        </form>

        {!soloAdmin && <p className="auth-switch">{modo === 'registro' ? '¿Ya tenés una cuenta?' : '¿Primera vez en ReUse?'}{' '}
          <button type="button" onClick={() => { setModo(modo === 'registro' ? 'ingresar' : 'registro'); setError(''); }}>{modo === 'registro' ? 'Iniciá sesión' : 'Crear cuenta'}</button>
        </p>}
        <button className="text-button auth-back" onClick={alVolver}>← Volver a ReUse</button>
      </div>
    </section>
  );
}
