import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {MarkerModel, MarkerType} from './shared/models/marker.model';
import {MatDialog} from '@angular/material/dialog';
import {AddMarkerDialogComponent} from './components/add-marker-dialog/add-marker-dialog.component';
import {Point} from 'mapbox-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat = 40;
  lng = -90;
  clickCoords = {lat: 0.0, lng: 0.0};
  markers: mapboxgl.Marker[] = [];
  data: MarkerModel = {type: 'FeatureCollection', features: []};
  isRotationOn = true;
  secondsPerRevolution = 120;
  maxSpinZoom = 5;
  slowSpinZoom = 3;
  userInteracting = false;
  spinEnabled = true;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZGF3a29uIiwiYSI6ImNsbzMyNThzMjBneHIydXVkczBqZWVuMjcifQ.4RwRdbAXLqwimZ8QY2aHnQ',
      container: 'map',
      style: this.style,
      zoom: 1.5,
      center: [this.lng, this.lat]
    });
    this.map.doubleClickZoom.disable();
    this.map.on('load', () => {
      this.spinGlobe();
      this.map?.addSource('adsTrips', {
        type: 'geojson',
        data: this.data as any
      });

      this.map?.addLayer({
        'id': 'earthquakes-layer',
        'type': 'circle',
        'source': 'adsTrips',
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
        }
      });
    });
    this.map.on('click', (e) => {
      this.isRotationOn = false;
      this.clickCoords = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng
      };
      console.log(this.data);
      console.log(JSON.stringify([e.lngLat.lng, e.lngLat.lat]));
    });
    this.map.on('dblclick', (e) => {
      const dialogRef = this.dialog.open(AddMarkerDialogComponent);
      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          const newMarker = {
            type: 'Feature',
            properties: {
              id: this.data.features.length.toString(),
              content: {
                user: result.user,
                description: result.description,
              },
              'marker-color': '#3bb2d0',
              'marker-size': 'large',
              'marker-symbol': '1'
            },
            geometry: {
              type: 'Point',
              coordinates: this.clickCoords
            }
          };

          this.data.features = [...this.data.features, newMarker];
          let color;
          // switch (result.type) {
          //   case MarkerType.VACATION:
          //     color =
          //
          // }

          this.markers.push(new mapboxgl.Marker()
            .setLngLat(newMarker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popup">
                <h2 class="marker-user">${newMarker.properties.content.user}</h2>
                <span class="marker-description">${newMarker.properties.content.description}</span>
            </div>
            `)));

          this.markers.forEach(m => {
            m.remove();
            m.addTo(this.map as mapboxgl.Map);
          });
        }
      });
    });
    this.initMapEvents();
  }

  spinGlobe() {
    const zoom = this.map?.getZoom();
    if (this.spinEnabled && !this.userInteracting && zoom && zoom < this.maxSpinZoom) {
      let distancePerSecond = 360 / this.secondsPerRevolution;
      if (zoom > this.slowSpinZoom) {
        const zoomDif =
          (this.maxSpinZoom - zoom) / (this.maxSpinZoom - this.slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = this.map?.getCenter();
      if (center) {
        center.lng -= distancePerSecond;
        this.map?.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }
  }

  initMapEvents() {
    if (this.map) {
      this.map.on('mousedown', () => {
        this.userInteracting = true;
      });
      this.map.on('mouseup', () => {
        this.userInteracting = false;
        this.spinGlobe();
      });
      this.map.on('dragend', () => {
        this.userInteracting = false;
        this.spinGlobe();
      });
      this.map.on('pitchend', () => {
        this.userInteracting = false;
        this.spinGlobe();
      });
      this.map.on('rotateend', () => {
        this.userInteracting = false;
        this.spinGlobe();
      });
      this.map.on('moveend', () => {
        this.spinGlobe();
      });
    }
  }

}
