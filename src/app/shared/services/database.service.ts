import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import {MarkerContent, User} from '../models/marker.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  supabase = createClient('https://wmjtikmrsypdzeiwjdtr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtanRpa21yc3lwZHplaXdqZHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDM3MjUsImV4cCI6MjAxMzgxOTcyNX0.3FGlchFVA1g6WwXUG1XJLGoHxOBqHOYXOVg_SDME_f8')

  constructor() { }

  getAllMarkers() {
    return this.supabase.from('markers').select();
  }

  async addNewMarker(marker: MarkerContent) {
    await this.supabase.from('markers').insert([{who: marker.who, description: marker.description, lat: marker.lat, lng: marker.lng}]);
  }

  getUsers() {
    return this.supabase.from('users').select();
  }

  async addNewUser(user: User) {
    await this.supabase.from('users').insert([{name: user.name, color: user.color }]);
  }

  async updateUser(user: User) {
    await this.supabase.from('users').update([{name: user.name, color: user.color }]).eq('name', user.name);
  }

}
