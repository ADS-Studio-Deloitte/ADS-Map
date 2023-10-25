import {LngLatLike} from 'mapbox-gl';

export interface MarkerModel {
  type: string;
  features: FeatureModel[];
}

export interface FeatureModel {
  type: string;
  properties: {
    id: string;
    content: MarkerContent;
    'marker-color': string;
    'marker-size': string;
    'marker-symbol': string;
  };
  geometry: {
    type: string;
    coordinates: LngLatLike;
  }
}

export interface MarkerContent {
  id?: number;
  who: string;
  description: string;
  lng: number;
  lat: number;
}

export enum MarkerType {
  VACATION, CITE, ADS_MEMORIES
}
