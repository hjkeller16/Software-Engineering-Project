import { Injectable } from '@angular/core';
import { Location } from './location';

@Injectable({
  providedIn: 'root'
})
export class MockLocationService {

  constructor() { }

  private mockLocations: Location[] = [{
    id: 10,
    lat: 4,
    lng: 4,
    name: "Test location 1",
    address: "Turmstraße 8, Lu",
    category: "Fußball",
    description: "This is a test location",
    user_id: "testUser",
    image: null,
    avgrating: 3
  }, {
    id: 20,
    lat: 2,
    lng: 2,
    name: "Test location 2",
    address: "Turmstraße 9, Lu",
    category: "Basketball",
    description: "This is a test location",
    user_id: "anotherUser",
    image: null,
    avgrating: 3
  }];

  getAll() {
    return this.mockLocations;
  }
}
