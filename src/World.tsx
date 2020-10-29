import React from "react";
import { Map, TileLayer, Marker, Popup, Viewport } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";

export interface IPhoto {
  url: string;
  position: L.LatLngExpression;
  uid: string;
  file: File;
}

interface IWorld {
  photos: IPhoto[];
  viewport: Viewport;
  onViewportChange: (e: Viewport) => void;
}

export default function World({ photos, viewport, onViewportChange }: IWorld) {
  return (
    <Map
      onViewPortChanged={onViewportChange}
      viewport={viewport}
      style={{ height: "calc(100vh - 64px)", width: "100%" }}
      maxZoom={20}
    >
      <TileLayer
        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
        attribution='<a href="https://github.com/titouancreach"> @titouancreach </a>'
        id="mapbox/streets-v11"
        accessToken="pk.eyJ1IjoieXVuamllbGkiLCJhIjoiY2lxdmV5MG5rMDAxNmZta3FlNGhyMmpicSJ9.CTEQgAyZGROcpJouZuzJyA"
        zoomOffset={-1}
        tileSize={512}
      />

      <MarkerClusterGroup
        showCoverageOnHover={false}
        maxClusterRadius={100}
        iconCreateFunction={cluster => {
          const firstPhoto = cluster!.getAllChildMarkers()[0]!.options!.icon!
            .options as L.DivIconOptions;
          const firstPhotoHtml = firstPhoto.html;
          return L.divIcon({
            className: "leaflet-marker-photo",
            html: `${firstPhotoHtml}​<b>${cluster.getChildCount()}</b>`,
            iconSize: [64, 64]
          });
        }}
      >
        {photos.map(photo => (
          <Marker
            position={photo.position}
            key={photo.url}
            icon={L.divIcon({
              html: `<div style="background-image: url(${photo.url});"></div>`,
              className: "leaflet-marker-photo",
              iconSize: [40, 40]
            })}
          >
            <Popup className="leaflet-popup-photo" minWidth={400}>
              <figure>
                <img src={photo.url} alt="popup" />
                <figcaption className="pt2 tc">{photo.file.name}</figcaption>
              </figure>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </Map>
  );
}
