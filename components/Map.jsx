import React from "react";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = () => {
  return (
    <div className="map_wrap">
      <div className="map">
        <Map
          initialViewState={{
            latitude: 48.8596893,
            longitude: 2.3522921,
            zoom: 10,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken="pk.eyJ1IjoiYmF5YXppZGgiLCJhIjoiY2tvemdwc3ByMDg1YzJubzQxcDR0cDR3dyJ9.s1zXEb5OPqgBDcmupj3GBA"
        />
      </div>
    </div>
  );
};

export default MapComponent;
