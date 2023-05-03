import React, { useState} from 'react';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';

// Source data CSV
 
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

// isko change kar ke US ke aas pass kar do initially wnha aayega
const INITIAL_VIEW_STATE = {
  longitude: -81.54108009813592,
  latitude: 28.557424179221353,
  zoom: 10,
  minZoom: 5,
  maxZoom: 20,
  pitch: 40.5,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';


export const colorRange = [
  [5, 189, 91],
  [7, 119, 190],
  [190, 6, 6]
];

function getTooltip({object}) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];
  const IRR = object.points[0].source.IRR;
  return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
    IRR ${IRR}`;
}

const getColour = (d) => {
  return d[0].IRR;
}

/* eslint-disable react/no-deprecated */
export function HexagonMap({
  data,
  mapStyle = MAP_STYLE,
  rad = 500,
  upperPercentile = 100,
  coverage = 1
}) {
  const [radius, setRadius] = useState(rad);

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, ms);
    };
  }
  
  const handleRequest = debounce((viewState) => {
    const { latitude, longitude, zoom } = viewState;
    // Make request
    // if(zoom >= 12){
    //   setRadius(10)
    // }else if(zoom < 12) {
    //    setRadius(200)
    //   }else if (zoom < 10) {
    //     setRadius(500)
    //   }
    //   else if(zoom < 8) {
    //     setRadius(1000)
    //   }else {
    //     setRadius(2000)
    //   }
  }
  )


  const layers = [
    new HexagonLayer({
      id: 'heatmap',
      colorRange,
      coverage,
      data,
      elevationRange: [0, 3000],
      elevationScale: data && data.length ? 50 : 0,
      extruded: true,
      getPosition: (d) => {return d.position;},
      pickable: true,
      radius,
      upperPercentile,
      material,
      getColorValue : getColour, 
      transitions: {
        elevationScale: 3000
      }
    })
  ];

  return (
    <DeckGL
      layers={layers}
      effects={[lightingEffect]}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
      onViewStateChange={({ viewState }) => handleRequest(viewState, 500)}
    >
      <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}
