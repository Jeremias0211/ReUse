import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';

// Corregir icono por defecto de Leaflet en React si es necesario
import 'leaflet/dist/leaflet.css';

export default function MapaUbicacion({ ubicacion }) {
  const { ciudad, zona, lat, lng, radioMetros } = ubicacion;
  const posicion = [lat, lng];
  const radio = radioMetros || 800;

  return (
    <div>
      <div className="map-wrapper">
        <MapContainer 
          center={posicion} 
          zoom={14} 
          scrollWheelZoom={false} 
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Círculo de zona aproximada */}
          <Circle 
            center={posicion} 
            radius={radio}
            pathOptions={{ color: '#16A085', fillColor: '#16A085', fillOpacity: 0.3 }}
          />
          {/* Marcador de ubicación exacta */}
          <Marker position={posicion}>
            <Popup>
              <strong>{ciudad}</strong><br />{zona}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>📍</span>
        <span><strong>{ciudad}, {zona}</strong> · Ubicación aproximada y punto exacto</span>
      </p>
    </div>
  );
}
