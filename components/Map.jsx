'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix default marker icon issue
const warehouseIcon = new L.Icon({
  iconUrl: 'data:image/png;base64,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',
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const storeIcon = new L.Icon({
  iconUrl: 'data:image/png;base64,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',
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const locations = [
  // North
  { id: 1, name: 'Warehouse - Jaipur', lat: 26.9124, lng: 75.7873, type: 'Warehouse' },
  { id: 2, name: 'Store - Delhi', lat: 28.6139, lng: 77.2090, type: 'Store' },
  { id: 3, name: 'Store - Chandigarh', lat: 30.7333, lng: 76.7794, type: 'Store' },
  { id: 4, name: 'Store - Lucknow', lat: 26.8467, lng: 80.9462, type: 'Store' },

  // South
  { id: 5, name: 'Warehouse - Coimbatore', lat: 11.0168, lng: 76.9558, type: 'Warehouse' },
  { id: 6, name: 'Store - Hyderabad', lat: 17.3850, lng: 78.4867, type: 'Store' },
  { id: 7, name: 'Store - Chennai', lat: 13.0827, lng: 80.2707, type: 'Store' },
  { id: 8, name: 'Store - Bengaluru', lat: 12.9716, lng: 77.5946, type: 'Store' },
  { id: 9, name: 'Store - Kochi', lat: 9.9312, lng: 76.2673, type: 'Store' },

  // East
  { id: 10, name: 'Warehouse - Bhubaneswar', lat: 20.2961, lng: 85.8245, type: 'Warehouse' },
  { id: 11, name: 'Store - Guwahati', lat: 26.1445, lng: 91.7362, type: 'Store' },
  { id: 12, name: 'Store - Kolkata', lat: 22.5726, lng: 88.3639, type: 'Store' },

  // West
  { id: 13, name: 'Warehouse - Ahmedabad', lat: 23.0225, lng: 72.5714, type: 'Warehouse' },
  { id: 14, name: 'Store - Mumbai', lat: 19.0760, lng: 72.8777, type: 'Store' },
  { id: 15, name: 'Store - Pune', lat: 18.5204, lng: 73.8567, type: 'Store' },
];



export default function Map() {
  return (
    <div className="w-full h-[90vh] px-2 py-3.5 rounded-lg relative">
      <MapContainer center={[22.9734, 78.6569]} zoom={5.4} scrollWheelZoom={true} className="h-full w-full rounded-lg z-10">
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={loc.type === 'Warehouse' ? warehouseIcon : storeIcon}
          >
            <Popup>
              <strong>{loc.name}</strong><br />
              Type: {loc.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}