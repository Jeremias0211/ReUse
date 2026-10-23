/**
 * ==========================================
 * SERVIDOR DEL BACKEND (Node.js con Express)
 * ==========================================
 * Este archivo arma un servidor web casero que responde a 
 * las consultas de la página web (frontend) cuando el usuario 
 * busca productos o entra a ver el detalle de uno.
 */

// Importamos las herramientas necesarias
const express = require('express');
const cors = require('cors');

// Creamos la aplicación del servidor
const app = express();
const puerto = process.env.PORT || 4000;

// Permitimos que la página web (que corre en otro puerto) pueda hablar con este servidor
app.use(cors());
app.use(express.json());

// Lista con 6 productos de ejemplo (datos falsos) para mostrar en la pantalla.
// SUGERENCIA: Más adelante esto se va a reemplazar por una base de datos SQL.
const listaProductos = [
  {
    id: "1",
    titulo: "iPhone 11 64GB - Blanco",
    categoria: "Celulares",
    precio: 380000,
    descripcion: "iPhone 11 en excelente estado estético y funcional. Batería al 88%. Incluye cargador alternativo.",
    condicion: "Excelente",
    revision: [
      { etiqueta: "Pantalla sin rayas", ok: true },
      { etiqueta: "Batería revisada (>85%)", ok: true },
      { etiqueta: "Face ID funcional", ok: true }
    ],
    ubicacion: {
      ciudad: "Lanús",
      zona: "Lanús Este, cerca de estación",
      lat: -34.7065,
      lng: -58.3882,
      radioMetros: 800
    },
    vendedor: { nombre: "Martín G." }
  },
  {
    id: "2",
    titulo: "Notebook Lenovo ThinkPad T480 i5 8GB SSD 256GB",
    categoria: "Notebooks",
    precio: 450000,
    descripcion: "ThinkPad robusta para trabajo y estudio. Procesador Intel Core i5. Teclado en español.",
    condicion: "Muy bueno",
    revision: [
      { etiqueta: "Teclado y touchpad funcionando", ok: true },
      { etiqueta: "SSD en óptimo estado", ok: true },
      { etiqueta: "Cargador original incluido", ok: true }
    ],
    ubicacion: {
      ciudad: "Lomas de Zamora",
      zona: "Centro, Lomas",
      lat: -34.7578,
      lng: -58.4014,
      radioMetros: 1000
    },
    vendedor: { nombre: "Sofía R." }
  },
  {
    id: "3",
    titulo: "PlayStation 4 Slim 1TB + 1 Joystick",
    categoria: "Consolas",
    precio: 320000,
    descripcion: "PS4 Slim funcionando perfecto. Lacre intacto. Incluye cables y joystick original.",
    condicion: "Muy bueno",
    revision: [
      { etiqueta: "Lector de Blu-ray operativo", ok: true },
      { etiqueta: "Wi-Fi y puertos USB probados", ok: true },
      { etiqueta: "Joystick con drift leve", ok: false }
    ],
    ubicacion: {
      ciudad: "Avellaneda",
      zona: "Wilde centro",
      lat: -34.7023,
      lng: -58.3364,
      radioMetros: 900
    },
    vendedor: { nombre: "Lucas P." }
  },
  {
    id: "4",
    titulo: "Monitor Gamer LG 24\" Full HD IPS",
    categoria: "Monitores",
    precio: 180000,
    descripcion: "Monitor LG de 24 pulgadas con tecnología IPS. Excelente definición.",
    condicion: "Excelente",
    revision: [
      { etiqueta: "Sin píxeles quemados", ok: true },
      { etiqueta: "Panel IPS sin manchas", ok: true },
      { etiqueta: "Base y soporte originales", ok: true }
    ],
    ubicacion: {
      ciudad: "Banfield",
      zona: "Banfield Oeste",
      lat: -34.7351,
      lng: -58.4069,
      radioMetros: 700
    },
    vendedor: { nombre: "Camila V." }
  },
  {
    id: "5",
    titulo: "Auriculares HyperX Cloud Stinger Inalámbricos",
    categoria: "Auriculares",
    precio: 75000,
    descripcion: "Auriculares gamer inalámbricos con autonomía de hasta 17 horas.",
    condicion: "Bueno",
    revision: [
      { etiqueta: "Audio y micrófono limpios", ok: true },
      { etiqueta: "Conexión inalámbrica estable", ok: true },
      { etiqueta: "Almohadillas con desgaste", ok: false }
    ],
    ubicacion: {
      ciudad: "Lanús",
      zona: "Remedios de Escalada",
      lat: -34.7231,
      lng: -58.3842,
      radioMetros: 800
    },
    vendedor: { nombre: "Esteban M." }
  },
  {
    id: "6",
    titulo: "Teclado Mecánico Redragon Kumara Switch Red",
    categoria: "Periféricos",
    precio: 35000,
    descripcion: "Teclado mecánico formato TKL con switches rojos y retroiluminación.",
    condicion: "Aceptable",
    revision: [
      { etiqueta: "Teclas funcionando correctamente", ok: true },
      { etiqueta: "Falta patita rebatible trasera", ok: false }
    ],
    ubicacion: {
      ciudad: "Lomas de Zamora",
      zona: "Temperley este",
      lat: -34.7765,
      lng: -58.3912,
      radioMetros: 1000
    },
    vendedor: { nombre: "Agustín B." }
  }
];

// Ruta 1: Comprobar que el servidor está vivo
app.get('/api/estado', (req, res) => {
  res.json({ estado: "ok" });
});

// Ruta 2: Devolver todos los productos (o filtrados por categoría si el usuario hace clic en una)
app.get('/api/productos', (req, res) => {
  const categoriaElegida = req.query.categoria;
  
  if (categoriaElegida && categoriaElegida !== 'Todas') {
    const filtrados = listaProductos.filter(p => p.categoria.toLowerCase() === categoriaElegida.toLowerCase());
    return res.json(filtrados);
  }
  
  res.json(listaProductos);
});

// Ruta 3: Devolver un solo producto buscando por su número de ID
app.get('/api/productos/:id', (req, res) => {
  const idBuscado = req.params.id;
  const productoEncontrado = listaProductos.find(p => p.id === idBuscado);
  
  if (!productoEncontrado) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  
  res.json(productoEncontrado);
});

// Encendemos el servidor en el puerto indicado
app.listen(puerto, () => {
  console.log(`Servidor funcionando en http://localhost:${puerto}`);
});
