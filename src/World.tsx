import React, { useEffect, useState } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { inputToDataUrl, extractPositionOfImage } from "./utils";
import { RcFile } from "antd/lib/upload/interface";

export interface IPhoto {
  url: string;
  position: L.LatLngExpression;
  uid: string;
}

interface IWorld {
  files: RcFile[];
}

export default function World({ files }: IWorld) {
  const [photos, setPhotos] = useState<IPhoto[]>([]);

  useEffect(() => {
    async function fileToPhoto(file: RcFile): Promise<IPhoto> {
      const [url, position] = await Promise.all([
        inputToDataUrl(file),
        extractPositionOfImage(file)
      ]);

      const { uid } = file;
      return {
        position,
        url,
        uid
      };
    }

    const photoPromises = files.map(fileToPhoto);

    Promise.all(photoPromises).then(phts => {
      console.log(phts);
      setPhotos(phts);
    });
  }, [files]);

  return (
    <Map
      center={[48.8534, 2.3488]}
      zoom={13}
      style={{ height: "calc(100vh - 64px)", width: "100%" }}
      maxZoom={20}
    >
      <TileLayer
        url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        id="mapbox.streets"
        accessToken="pk.eyJ1IjoieXVuamllbGkiLCJhIjoiY2lxdmV5MG5rMDAxNmZta3FlNGhyMmpicSJ9.CTEQgAyZGROcpJouZuzJyA"
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
              <div>
                <img src={photo.url} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </Map>
  );
}
