'use client';

import { Map } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GlassCard } from '@/components/ui/GlassCard';

export default function MapBox() {
  return (
    <GlassCard variant="subtle" className="overflow-hidden h-[400px] w-full">
      <Map
        initialViewState={{
          latitude: 48.8596893,
          longitude: 2.3522921,
          zoom: 11,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken="pk.eyJ1IjoiYmF5YXppZGgiLCJhIjoiY2tvemdwc3ByMDg1YzJubzQxcDR0cDR3dyJ9.s1zXEb5OPqgBDcmupj3GBA"
      />
    </GlassCard>
  );
}
