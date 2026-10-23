import React from 'react';

const CATEGORIAS = [
  'Todas',
  'Celulares',
  'Notebooks',
  'Consolas',
  'Monitores',
  'Auriculares',
  'Periféricos',
  'Otros'
];

export default function BarraCategorias({ categoriaSeleccionada, alSeleccionarCategoria }) {
  return (
    <div className="category-bar">
      {CATEGORIAS.map((cat) => (
        <button
          key={cat}
          onClick={() => alSeleccionarCategoria(cat)}
          className={`category-chip ${categoriaSeleccionada === cat ? 'active' : ''}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
