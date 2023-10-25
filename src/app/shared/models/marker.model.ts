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
  user: string;
  description: string;
}

export enum MarkerType {
  VACATION, CITE, ADS_MEMORIES
}
