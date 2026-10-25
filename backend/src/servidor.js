const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const puerto = process.env.PORT || 4000;
const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'store.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const productosIniciales = [
  { id: '1', titulo: 'iPhone 11 64GB - Blanco', categoria: 'Celulares', precio: 380000, descripcion: 'iPhone 11 en excelente estado estético y funcional. Batería al 88%. Incluye cargador alternativo.', condicion: 'Excelente', revision: [{ etiqueta: 'Pantalla sin rayas', ok: true }, { etiqueta: 'Batería revisada (>85%)', ok: true }, { etiqueta: 'Face ID funcional', ok: true }], ubicacion: { ciudad: 'Lanús', zona: 'Lanús Este, cerca de estación', lat: -34.7065, lng: -58.3882, radioMetros: 800 }, vendedor: { nombre: 'Martín G.' } },
  { id: '2', titulo: 'Notebook Lenovo ThinkPad T480 i5 8GB SSD 256GB', categoria: 'Notebooks', precio: 450000, descripcion: 'ThinkPad robusta para trabajo y estudio. Procesador Intel Core i5. Teclado en español.', condicion: 'Muy bueno', revision: [{ etiqueta: 'Teclado y touchpad funcionando', ok: true }, { etiqueta: 'SSD en óptimo estado', ok: true }, { etiqueta: 'Cargador original incluido', ok: true }], ubicacion: { ciudad: 'Lomas de Zamora', zona: 'Centro, Lomas', lat: -34.7578, lng: -58.4014, radioMetros: 1000 }, vendedor: { nombre: 'Sofía R.' } },
  { id: '3', titulo: 'PlayStation 4 Slim 1TB + 1 Joystick', categoria: 'Consolas', precio: 320000, descripcion: 'PS4 Slim funcionando perfecto. Lacre intacto. Incluye cables y joystick original.', condicion: 'Muy bueno', revision: [{ etiqueta: 'Lector de Blu-ray operativo', ok: true }, { etiqueta: 'Wi-Fi y puertos USB probados', ok: true }, { etiqueta: 'Joystick con drift leve', ok: false }], ubicacion: { ciudad: 'Avellaneda', zona: 'Wilde centro', lat: -34.7023, lng: -58.3364, radioMetros: 900 }, vendedor: { nombre: 'Lucas P.' } },
  { id: '4', titulo: 'Monitor Gamer LG 24" Full HD IPS', categoria: 'Monitores', precio: 180000, descripcion: 'Monitor LG de 24 pulgadas con tecnología IPS. Excelente definición.', condicion: 'Excelente', revision: [{ etiqueta: 'Sin píxeles quemados', ok: true }, { etiqueta: 'Panel IPS sin manchas', ok: true }, { etiqueta: 'Base y soporte originales', ok: true }], ubicacion: { ciudad: 'Banfield', zona: 'Banfield Oeste', lat: -34.7351, lng: -58.4069, radioMetros: 700 }, vendedor: { nombre: 'Camila V.' } },
  { id: '5', titulo: 'Auriculares HyperX Cloud Stinger Inalámbricos', categoria: 'Auriculares', precio: 75000, descripcion: 'Auriculares gamer inalámbricos con autonomía de hasta 17 horas.', condicion: 'Bueno', revision: [{ etiqueta: 'Audio y micrófono limpios', ok: true }, { etiqueta: 'Conexión inalámbrica estable', ok: true }, { etiqueta: 'Almohadillas con desgaste', ok: false }], ubicacion: { ciudad: 'Lanús', zona: 'Remedios de Escalada', lat: -34.7231, lng: -58.3842, radioMetros: 800 }, vendedor: { nombre: 'Esteban M.' } },
  { id: '6', titulo: 'Teclado Mecánico Redragon Kumara Switch Red', categoria: 'Periféricos', precio: 35000, descripcion: 'Teclado mecánico formato TKL con switches rojos y retroiluminación.', condicion: 'Aceptable', revision: [{ etiqueta: 'Teclas funcionando correctamente', ok: true }, { etiqueta: 'Falta patita rebatible trasera', ok: false }], ubicacion: { ciudad: 'Lomas de Zamora', zona: 'Temperley este', lat: -34.7765, lng: -58.3912, radioMetros: 1000 }, vendedor: { nombre: 'Agustín B.' } }
].map((producto) => ({ ...producto, disponible: true, vendido: false, fotos: [] }));

function guardar(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  const temporal = `${dataFile}.tmp`;
  fs.writeFileSync(temporal, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(temporal, dataFile);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function cargar() {
  fs.mkdirSync(dataDir, { recursive: true });
  const store = fs.existsSync(dataFile)
    ? JSON.parse(fs.readFileSync(dataFile, 'utf8'))
    : { users: [], products: productosIniciales, orders: [] };
  store.users ||= [];
  store.products ||= productosIniciales;
  store.orders ||= [];
  store.sessionSecret ||= crypto.randomBytes(32).toString('hex');
  const emailAdmin = (process.env.ADMIN_EMAIL || 'admin@reuse.local').trim().toLowerCase();
  if (!store.users.some((usuario) => usuario.email === emailAdmin)) {
    const passwordAdmin = process.env.ADMIN_PASSWORD || 'admin123';
    const credenciales = hashPassword(passwordAdmin);
    store.users.push({ id: crypto.randomUUID(), nombre: 'Administrador', email: emailAdmin, ...credenciales, role: 'admin', creadoEn: new Date().toISOString() });
  }
  guardar(store);
  return store;
}

let store = cargar();

function vistaUsuario(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, role: usuario.role };
}

function crearToken(usuario) {
  const payload = Buffer.from(JSON.stringify({ sub: usuario.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const firma = crypto.createHmac('sha256', store.sessionSecret).update(payload).digest('base64url');
  return `${payload}.${firma}`;
}

function autenticar(req, res, next) {
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const partes = token.split('.');
  if (partes.length !== 2) return res.status(401).json({ error: 'Iniciá sesión para continuar.' });
  try {
    const esperado = crypto.createHmac('sha256', store.sessionSecret).update(partes[0]).digest();
    const recibido = Buffer.from(partes[1], 'base64url');
    if (esperado.length !== recibido.length || !crypto.timingSafeEqual(esperado, recibido)) throw new Error('Firma inválida');
    const payload = JSON.parse(Buffer.from(partes[0], 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) throw new Error('Sesión vencida');
    const usuario = store.users.find((registro) => registro.id === payload.sub);
    if (!usuario) throw new Error('Usuario inexistente');
    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ error: 'La sesión venció. Volvé a iniciar sesión.' });
  }
}

function soloAdmin(req, res, next) {
  if (req.usuario.role !== 'admin') return res.status(403).json({ error: 'Esta sección es exclusiva para administradores.' });
  next();
}

function productoValido(body) {
  return typeof body.titulo === 'string' && body.titulo.trim() &&
    typeof body.categoria === 'string' && body.categoria.trim() &&
    Number.isFinite(Number(body.precio)) && Number(body.precio) > 0;
}

app.get('/api/estado', (_req, res) => res.json({ estado: 'ok' }));

app.post('/api/auth/registro', (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (nombre.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return res.status(400).json({ error: 'Ingresá un nombre, un email válido y una contraseña de 8 caracteres como mínimo.' });
  }
  if (store.users.some((usuario) => usuario.email === email)) return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
  const credenciales = hashPassword(password);
  const usuario = { id: crypto.randomUUID(), nombre, email, ...credenciales, role: 'user', creadoEn: new Date().toISOString() };
  store.users.push(usuario);
  guardar(store);
  res.status(201).json({ token: crearToken(usuario), usuario: vistaUsuario(usuario) });
});

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const usuario = store.users.find((registro) => registro.email === email);
  const hash = usuario ? crypto.scryptSync(password, usuario.salt, 64) : Buffer.alloc(64);
  if (!usuario || !crypto.timingSafeEqual(hash, Buffer.from(usuario.hash, 'hex'))) {
    return res.status(401).json({ error: 'El email o la contraseña no son correctos.' });
  }
  res.json({ token: crearToken(usuario), usuario: vistaUsuario(usuario) });
});

app.get('/api/auth/me', autenticar, (req, res) => res.json({ usuario: vistaUsuario(req.usuario) }));

app.get('/api/productos/preview', (_req, res) => {
  const productos = store.products
    .filter((producto) => producto.disponible !== false)
    .slice(0, 3)
    .map(({ id, titulo, categoria, condicion, fotos }) => ({ id, titulo, categoria, condicion, foto: fotos?.[0] || '' }));
  res.json(productos);
});

app.get('/api/productos', autenticar, (req, res) => {
  const categoria = req.query.categoria;
  const productos = store.products.filter((producto) => producto.disponible !== false &&
    (!categoria || categoria === 'Todas' || producto.categoria.toLowerCase() === String(categoria).toLowerCase()));
  res.json(productos);
});

app.get('/api/productos/:id', autenticar, (req, res) => {
  const producto = store.products.find((item) => item.id === req.params.id && item.disponible !== false);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado o ya vendido.' });
  res.json(producto);
});

app.post('/api/productos', autenticar, (req, res) => {
  const body = req.body;
  if (!productoValido(body)) return res.status(400).json({ error: 'Completá el título, la categoría y un precio mayor a cero.' });
  const fotos = Array.isArray(body.fotos) ? body.fotos.filter((foto) => typeof foto === 'string' && foto.startsWith('data:image/')).slice(0, 5) : [];
  const producto = {
    id: crypto.randomUUID(), titulo: body.titulo.trim().slice(0, 120), categoria: body.categoria.trim().slice(0, 60),
    precio: Math.round(Number(body.precio)), descripcion: String(body.descripcion || '').trim().slice(0, 2000),
    condicion: String(body.condicion || 'Bueno'), revision: Array.isArray(body.revision) ? body.revision : [],
    ubicacion: body.ubicacion && typeof body.ubicacion === 'object' ? body.ubicacion : { ciudad: 'Sin especificar', zona: 'A coordinar', lat: -34.6037, lng: -58.3816, radioMetros: 1000 },
    vendedor: { nombre: req.usuario.nombre }, fotos, disponible: true, vendido: false, creadoEn: new Date().toISOString()
  };
  store.products.unshift(producto);
  guardar(store);
  res.status(201).json(producto);
});

app.patch('/api/productos/:id', autenticar, soloAdmin, (req, res) => {
  const producto = store.products.find((item) => item.id === req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
  if (typeof req.body.archivado !== 'boolean') return res.status(400).json({ error: 'Indicá si querés archivar o reactivar la publicación.' });
  if (!req.body.archivado && producto.vendido) {
    return res.status(409).json({ error: 'Un producto vendido no se puede volver a publicar.' });
  }
  producto.archivado = req.body.archivado;
  producto.disponible = !req.body.archivado;
  guardar(store);
  res.json(producto);
});

app.post('/api/compras', autenticar, (req, res) => {
  const ids = Array.isArray(req.body.productIds) ? [...new Set(req.body.productIds.map(String))] : [];
  const nombreTitular = String(req.body.nombreTitular || '').trim();
  const ultimosDigitos = String(req.body.ultimosDigitos || '');
  if (!ids.length || !nombreTitular || !/^\d{4}$/.test(ultimosDigitos)) {
    return res.status(400).json({ error: 'Revisá el carrito y los datos de la tarjeta.' });
  }
  const productos = ids.map((id) => store.products.find((producto) => producto.id === id && producto.disponible !== false));
  if (productos.some((producto) => !producto)) return res.status(409).json({ error: 'Uno de los productos ya no está disponible. Actualizá el carrito.' });
  const orden = {
    id: crypto.randomUUID(), referencia: `RU-${Date.now().toString(36).toUpperCase()}`,
    userId: req.usuario.id, comprador: { nombre: req.usuario.nombre, email: req.usuario.email },
    productos: productos.map(({ id, titulo, categoria, precio, fotos }) => ({ id, titulo, categoria, precio, foto: fotos?.[0] || '' })),
    total: productos.reduce((total, producto) => total + producto.precio, 0),
    metodo: 'Tarjeta de crédito/débito (simulación)', titular: nombreTitular, tarjetaUltimos4: ultimosDigitos,
    estado: 'Aprobado (simulado)', fecha: new Date().toISOString()
  };
  productos.forEach((producto) => { producto.disponible = false; producto.vendido = true; });
  store.orders.unshift(orden);
  guardar(store);
  res.status(201).json(orden);
});

app.get('/api/compras', autenticar, (req, res) => {
  const compras = req.usuario.role === 'admin' ? store.orders : store.orders.filter((orden) => orden.userId === req.usuario.id);
  res.json(compras);
});

app.get('/api/admin/datos', autenticar, soloAdmin, (req, res) => {
  res.json({
    productos: store.products,
    compras: store.orders,
    usuarios: store.users.map((usuario) => {
      const comprasUsuario = store.orders.filter((orden) => orden.userId === usuario.id);
      return {
        ...vistaUsuario(usuario),
        creadoEn: usuario.creadoEn,
        cantidadCompras: comprasUsuario.length,
        totalCompras: comprasUsuario.reduce((total, orden) => total + orden.total, 0)
      };
    }),
    totalVendido: store.orders.reduce((total, orden) => total + orden.total, 0)
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'El formato de los datos enviados no es válido.' });
  console.error(error);
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

app.listen(puerto, () => console.log(`Servidor funcionando en http://localhost:${puerto}`));
