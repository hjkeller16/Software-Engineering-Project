import { Component, NgZone } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../token-payload';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../location';
import { LocationRepositoryService } from '../location-repository.service';
import { MatDialog } from '@angular/material';
import { AddPlaceComponent } from '../add-place/add-place.component';
import { SelectMarkerComponent } from '../select-marker/select-marker.component';
import { LatLng } from '@agm/core';

declare const L;

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
  private map;

  constructor(private readonly authService: AuthService,
    private readonly locationRepositoryService: LocationRepositoryService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe(this.initializeComponent.bind(this));
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

  onMapClick(e) {
    this.dialog
      .open(AddPlaceComponent, {
        autoFocus: true,
        data: {
          lat: e.coords.lat,
          lng: e.coords.lng
        },
        panelClass: 'add-place-dialog-panel'
      })
      .afterClosed()
      .subscribe(result => {
        this.initializeComponent();
      });
  }

  onMarkerClick(location) {
    console.log(location);
    this.dialog
    .open(SelectMarkerComponent, {
      autoFocus: true,
      data: {
        location:location
      },
      panelClass: 'add-place-dialog-panel'
    })
    .afterClosed()
    .subscribe(result => {
      this.initializeComponent();
    });
  }
}
