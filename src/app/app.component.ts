import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;

  constructor() {

  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
                                  accessToken: 'pk.eyJ1IjoibWNocnVzY2llbCIsImEiOiJjbG8zMjJ0NmIxMXF2MmtvM2psbG5oMjRwIn0.swlsUfPVKIgIVPcCxz0VDA',
                                  container: 'map',
                                  style: this.style,
                                  zoom: 13,
                                  center: [this.lng, this.lat]
                                });
    // Add map controls
    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', ()=> {
      this.map?.addSource(
        'test',
        {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': [],
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [ -97.792921355615277, 30.127749592004189 ],
                  [ -97.792921355615277, 30.196912993949898 ],
                  [ -97.723644348336762, 30.231476492188843 ],
                  [ -97.654367341058247, 30.196912993949898 ],
                  [ -97.654367341058247, 30.127749592004189 ],
                  [ -97.723644348336762, 30.093149704984011 ],
                  [ -97.792921355615277, 30.127749592004189 ]
                ]
              ]
            }
          }
        }
      );



      this.map?.addSource('earthquakes', {
        type: 'geojson', // Use a URL for the value for the `data` property.
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
      });

//      this.map?.addLayer({
//                           'id': 'earthquakes-layer',
//                           'type': 'circle',
//                           'source': 'earthquakes',
//                           'paint': {
//                             'circle-radius': 4,
//                             'circle-stroke-width': 2,
//                             'circle-color': 'red',
//                             'circle-stroke-color': 'white'
//                           }
//                         });

      this.map?.addLayer({
                           'id': 'test',
                           'type': 'circle',
                           'source': 'test',
                           'paint': {
                             'circle-radius': 4,
                             'circle-stroke-width': 2,
                             'circle-color': 'red',
                             'circle-stroke-color': 'white'
                           }
                         });

      this.map?.on('click', 'earthquakes-layer', (e) => {
        console.log(`A click event has occurred on a visible portion of the poi-label layer at ${e.lngLat}`);
      });


      this.map?.on('dblclick', (e) => {


        console.log(`A click event has occurred on a visible portion of the poi-label layer at ${e.lngLat}`);
      });

    });



  }

}
