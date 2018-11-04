import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../token-payload';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../location';
import { LocationRepositoryService } from '../location-repository.service';

declare const L;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public location: Location;
  public tokenPayload: TokenPayload;
  private map;

  constructor(private readonly authService: AuthService, private readonly locationRepositoryService: LocationRepositoryService, private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(async (params) => {
      //Initialize location
      this.location = {
        id: '',
        category: '',
        name: '',
        description: '',
        address: '',
        city: '',
        lat: 0,
        lng: 0
      }

      //Initialize token payload
      this.tokenPayload = {
        username: '',
        iat: '',
        exp: ''
      };

      //Get token payload information
      await this.getTokenPayload();

      // Get current location
      const location: any = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      let latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

      // Initialize map
      await this.initializeMap(latlng, 13);

      // Add all locations
      this.addAllLocations();
    })
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  async getTokenPayload() {
    try {
      const tokenPayload: TokenPayload = await this.authService.payload();
      this.tokenPayload = tokenPayload;
    } catch (err) {
      console.log(err);
      this.tokenPayload = null;
    }
  }

  async initializeMap(latlng: string, viewHeight: number): Promise<any> {
    this.map = L.map('map').setView(latlng, viewHeight);

    // On load event
    this.map.on('load', () => {
      document.getElementById('map-loading-indicator').style.display = 'none';
    });
    // Add title layer to map
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'sk.eyJ1IjoiYW5uYWJhaWVyIiwiYSI6ImNqbmZ5OGczazA0dGczcHFubjh2MzhlNjcifQ.fgI9fzYtKDB3ZNNogLOyRA'
    }).addTo(this.map);
    L.marker(latlng).addTo(this.map);

    // Add new location with mouse click
    this.map.on('click', (e) => {
      this.router.navigate(['addPlace', { latlng: e.latlng }]);
    })
  }

  async addAllLocations() {
    const locations = await this.locationRepositoryService.getAll();
    debugger;
    locations.forEach((location) => {
      L.marker([location.lat, location.lng], {
        icon: this.createIcon(),
      }).addTo(this.map);
    });
  }

  createIcon() {
    return L.icon({
      iconUrl: './assets/map-marker-icon-64.png',
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    });
  }
}
