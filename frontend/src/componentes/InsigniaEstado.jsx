import React from 'react';

export default function InsigniaEstado({ condicion }) {
  const obtenerClase = (cond) => {
    switch (cond) {
      case 'Excelente': return 'badge badge-excelente';
      case 'Muy bueno': return 'badge badge-muy-bueno';
      case 'Bueno': return 'badge badge-bueno';
      case 'Aceptable': return 'badge badge-aceptable';
      default: return 'badge';
    }
  };

  return (
    <span className={obtenerClase(condicion)}>
      {condicion}
    </span>
  );
}
