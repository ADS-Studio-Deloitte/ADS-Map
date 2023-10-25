import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {FeatureModel, MarkerModel, User} from './shared/models/marker.model';
import {MatDialog} from '@angular/material/dialog';
import {AddMarkerDialogComponent} from './components/add-marker-dialog/add-marker-dialog.component';
import {Point} from 'mapbox-gl';
import {DatabaseService} from './shared/services/database.service';

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
  users: User[] = [];
  data: MarkerModel = {type: 'FeatureCollection', features: []};
  isRotationOn = true;
  secondsPerRevolution = 120;
  maxSpinZoom = 5;
  slowSpinZoom = 3;
  userInteracting = false;
  spinEnabled = true;

  constructor(private dialog: MatDialog, private databaseService: DatabaseService) {
  }

  ngOnInit() {
    this.loadAllUsersAndMarkersFromDB();
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZGF3a29uIiwiYSI6ImNsbzMyNThzMjBneHIydXVkczBqZWVuMjcifQ.4RwRdbAXLqwimZ8QY2aHnQ',
      container: 'map',
      style: this.style,
      zoom: 1.5,
      center: [this.lng, this.lat]
    });
    this.map.doubleClickZoom.disable();
    this.map.on('load', () => {
      this.getAllMarkersFromDB();
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
                who: result.who,
                description: result.description,
                lat: this.clickCoords.lat,
                lng: this.clickCoords.lng
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
          this.databaseService.addNewMarker(newMarker.properties.content).then(r => this.getAllMarkersFromDB());

          let userName = newMarker.properties.content.who;
          let userColor = `#${result.color.hex}`;
          let user = this.getUserFromCache(userName);

          if (user === undefined) {
            user = {name: userName, color: userColor};
            this.databaseService.addNewUser(user).then(() => this.loadAllUsersAndMarkersFromDB());
          } else {
            user.color = userColor;
            this.databaseService.updateUser(user).then(() => this.loadAllUsersAndMarkersFromDB());
          }

          this.data.features = [...this.data.features, newMarker];
          let color;
          // switch (result.type) {
          //   case MarkerType.VACATION:
          //     color =

        }
      });
    });
    // this.initMapEvents();
  }

  getUserFromCache(name: string) {
    return this.users.find(u => u.name === name)
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

  loadAllUsersAndMarkersFromDB() {
    this.databaseService.getUsers().then(response => {
      response.data?.forEach(u => {
        this.users.push({name: u.name, color: u.color})
      });
      this.getAllMarkersFromDB();
    })
  }

  getAllMarkersFromDB() {
    this.databaseService.getAllMarkers().then(response => {
      response.data?.forEach(d => {
        const newMarker = {
          type: 'Feature',
          properties: {
            id: this.data.features.length.toString(),
            content: {
              id: d.id,
              who: d.who,
              description: d.description,
              lng: d.lng,
              lat: d.lat
            },
            'marker-color': '#000000',
            'marker-size': 'large',
            'marker-symbol': '1'
          },
          geometry: {
            type: 'Point',
            coordinates: {
              lat: d.lat,
              lng: d.lng
            }
          }
        };
        this.addMarker(newMarker);
      });
      this.markers.forEach(m => {
        m.remove();
        m.addTo(this.map as mapboxgl.Map);
      });
    });
  }

  addMarker(newMarker: FeatureModel) {
    let userName = newMarker.properties.content.who;
    let user = this.getUserFromCache(userName);

    this.markers.push(new mapboxgl.Marker({ "color": user?.color })
      .setLngLat(newMarker.geometry.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popup">
                <h2 class="marker-user">${newMarker.properties.content.who}</h2>
                <span class="marker-description">${newMarker.properties.content.description}</span>
            </div>
            `)));
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
//      this.map.on('moveend', () => {
//        this.spinGlobe();
//      });
    }
  }

}
