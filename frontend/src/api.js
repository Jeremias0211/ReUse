export async function api(ruta, opciones = {}) {
  const { token, headers = {}, ...init } = opciones;
  const base = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:4000')).replace(/\/$/, '');
  let respuesta;
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      }
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Iniciá el backend y volvé a intentar.');
  }
  const contenido = await respuesta.text().catch(() => '');
  let datos;
  try { datos = contenido ? JSON.parse(contenido) : {}; }
  catch {
    if (!respuesta.ok) throw new Error(`El servidor respondió con HTTP ${respuesta.status} sin un mensaje válido. Revisá que VITE_API_URL apunte al backend.`);
    throw new Error('La dirección de la API devolvió una página en vez de datos. Revisá que VITE_API_URL apunte al backend.');
  }
  if (!respuesta.ok) throw new Error(datos.error || `El servidor respondió con HTTP ${respuesta.status}.`);
  return datos;
}

export const precioARS = (valor) => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0
}).format(Number(valor) || 0);
