import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../token-payload';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../location';
import { LocationRepositoryService } from '../location-repository.service';
import { MatBottomSheet, MatDialogRef } from '@angular/material';
import { MarkPlaceComponent } from '../mark-place/mark-place.component';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public currentLatLng = {
    lat: 0,
    lng: 0
  };
  public locations: Location[] = [];
  public tokenPayload: TokenPayload;
  geocoder: any;
  public selectedLatLng = null;

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

  async getTokenPayload() {
    try {
      const tokenPayload: TokenPayload = await this.authService.payload();
      this.tokenPayload = tokenPayload;
    } catch (err) {
      console.log(err);
      this.tokenPayload = null;
    }
  }


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

    if (dialogWrapper.ref) {
      await dialogWrapper.ref.afterClosed().toPromise();
      this.initializeComponent();
    }

    this.selectedLatLng = null;
  }

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

  onMarkerClick(location) {
    console.log(location);
  }
}
