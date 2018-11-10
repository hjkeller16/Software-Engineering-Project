import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../token-payload';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../location';
import { LocationRepositoryService } from '../location-repository.service';
import { MatBottomSheet } from '@angular/material';
import { MarkPlaceComponent } from '../mark-place/mark-place.component';
import { MapsAPILoader } from '@agm/core';
import { SelectMarkerComponent } from '../select-marker/select-marker.component';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // Variables
  public currentLatLng = {
    lat: 0,
    lng: 0
  };
  public locations: Location[] = [];
  public tokenPayload: TokenPayload;
  geocoder: any;
  public selectedLatLng = null;
  public origin: any;
  public destination: any;

  constructor(
    public mapsApiLoader: MapsAPILoader,
    private readonly authService: AuthService,
    private readonly locationRepositoryService: LocationRepositoryService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly bottomSheet: MatBottomSheet,
  ) {
    this.activatedRoute.params.subscribe(this.initializeComponent.bind(this));
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  async initializeComponent() {
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

    this.currentLatLng = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };

    this.locations = await this.locationRepositoryService.getAll();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  // Get user information through token
  async getTokenPayload() {
    try {
      const tokenPayload: TokenPayload = await this.authService.payload();
      this.tokenPayload = tokenPayload;
    } catch (err) {
      console.log(err);
      this.tokenPayload = null;
    }
  }

  // On click on map
  async onMapClick(e) {
    // Set market at selected location
    this.selectedLatLng = {
      lat: e.coords.lat,
      lng: e.coords.lng
    };

    // Get address from coordinates
    const address = await this.getAddressFromCoordinates(e.coords.lat, e.coords.lng);

    const dialogWrapper = {
      ref: null
    };

    await this.bottomSheet.open(MarkPlaceComponent, {
      data: {
        lat: e.coords.lat,
        lng: e.coords.lng,
        address: address,
        dialogWrapper
      },
    }).afterDismissed().toPromise();

    // If add-place component was closed the home component will be initilized to display added marker
    if (dialogWrapper.ref) {
      await dialogWrapper.ref.afterClosed().toPromise();
      this.initializeComponent();
    }

    this.selectedLatLng = null;
  }

  // Transfer coordinates into an address
  async getAddressFromCoordinates(lat, lng) {
    return new Promise((resolve, reject) => {
      let currAddress;
      this.geocoder.geocode({
        'location': {
          lat: lat,
          lng: lng
        }
      }, (results) => {
        currAddress = results[0].formatted_address
        resolve(currAddress);
      })
    })
  }

  // On click on marker display details
  async onMarkerClick(location) {
    console.log(location);
    let events = {
      showRouteClicked: false
    };
    await this.bottomSheet.open(SelectMarkerComponent, {
      data: {
        location: location,
        events
      },
    }).afterDismissed().toPromise();

    if (events.showRouteClicked) {
      this.showRoute(location);
    }
  }

  showRoute(location: Location) {
    this.origin = { lat: this.currentLatLng.lat, lng: this.currentLatLng.lng }
    this.destination = { lat: location.lat, lng: location.lng }
  }
}
