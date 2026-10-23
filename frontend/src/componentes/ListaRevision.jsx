import React from 'react';

export default function ListaRevision({ revision }) {
  if (!revision || revision.length === 0) return <p>Sin revisión detallada.</p>;

  return (
    <ul className="review-list">
      {revision.map((item, idx) => (
        <li key={idx} className="review-item">
          {item.ok ? (
            <span className="review-icon-ok">✔</span>
          ) : (
            <span className="review-icon-no">✖</span>
          )}
          <span>{item.etiqueta}</span>
        </li>
      ))}
    </ul>
  );
}
