import React from 'react';
import { Circle, Polygon } from 'react-leaflet';
import { CycloneTrackPoint } from '../../types';

interface PrecipitationRadarLayerProps {
  currentEye: CycloneTrackPoint;
  enabled: boolean;
}

export const PrecipitationRadarLayer: React.FC<PrecipitationRadarLayerProps> = ({
  currentEye,
  enabled,
}) => {
  if (!enabled) return null;

  const lat = currentEye.lat;
  const lng = currentEye.lng;

  // Generate spiral logarithmic convective rainbands
  const generateSpiralBand = (startAngleRad: number, lengthRad: number, widthKm: number, rStartKm: number) => {
    const points: [number, number][] = [];
    const steps = 24;
    const b = 0.22; // Spiral expansion constant
    const kmPerDegLat = 111.0;
    const kmPerDegLng = 111.0 * Math.cos((lat * Math.PI) / 180);

    for (let i = 0; i <= steps; i++) {
      const theta = startAngleRad + (i / steps) * lengthRad;
      const r = rStartKm * Math.exp(b * (theta - startAngleRad));
      const ptLat = lat + (r * Math.sin(theta)) / kmPerDegLat;
      const ptLng = lng + (r * Math.cos(theta)) / kmPerDegLng;
      points.push([ptLat, ptLng]);
    }

    // Return outward edge to form polygon band
    for (let i = steps; i >= 0; i--) {
      const theta = startAngleRad + (i / steps) * lengthRad;
      const r = (rStartKm + widthKm) * Math.exp(b * (theta - startAngleRad));
      const ptLat = lat + (r * Math.sin(theta)) / kmPerDegLat;
      const ptLng = lng + (r * Math.cos(theta)) / kmPerDegLng;
      points.push([ptLat, ptLng]);
    }

    return points;
  };

  // Multiple spiral feeder rainbands
  const band1 = generateSpiralBand(0.2, 2.8, 65, 40);
  const band2 = generateSpiralBand(Math.PI * 0.8, 3.0, 75, 55);
  const band3 = generateSpiralBand(Math.PI * 1.5, 2.5, 50, 70);

  return (
    <>
      {/* 1. Broad Outer Light Rainfall Field (Soft Translucent Blue) */}
      <Circle
        center={[lat, lng]}
        radius={380000} // 380 km
        pathOptions={{
          fillColor: '#38bdf8',
          fillOpacity: 0.14,
          stroke: false,
        }}
      />

      {/* 2. Intermediate Moderate Rainfall Ring (Cyan/Blue) */}
      <Circle
        center={[lat, lng]}
        radius={220000} // 220 km
        pathOptions={{
          fillColor: '#0284c7',
          fillOpacity: 0.25,
          stroke: false,
        }}
      />

      {/* 3. Spiral Convective Rainbands (Yellow & Orange) */}
      <Polygon
        positions={band1}
        pathOptions={{
          fillColor: '#eab308',
          fillOpacity: 0.35,
          stroke: false,
        }}
      />
      <Polygon
        positions={band2}
        pathOptions={{
          fillColor: '#f97316',
          fillOpacity: 0.38,
          stroke: false,
        }}
      />
      <Polygon
        positions={band3}
        pathOptions={{
          fillColor: '#0284c7',
          fillOpacity: 0.30,
          stroke: false,
        }}
      />

      {/* 4. Heavy Convective Eyewall Core (Red / Pink) */}
      <Circle
        center={[lat, lng]}
        radius={85000} // 85 km
        pathOptions={{
          fillColor: '#dc2626',
          fillOpacity: 0.45,
          stroke: false,
        }}
      />

      {/* 5. Extreme Torrential Core (>50 mm/h Magenta) */}
      <Circle
        center={[lat, lng]}
        radius={42000} // 42 km
        pathOptions={{
          fillColor: '#db2777',
          fillOpacity: 0.55,
          stroke: false,
        }}
      />
    </>
  );
};
