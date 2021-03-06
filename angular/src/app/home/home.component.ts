import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../token-payload';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '../location';
import { LocationRepositoryService } from '../location-repository.service';
import { SelectMarkerComponent } from '../select-marker/select-marker.component';
import { MatBottomSheet } from '@angular/material';
import { MarkPlaceComponent } from '../mark-place/mark-place.component';
import { MapsAPILoader } from '@agm/core';
import { SearchComponent } from '../search/search.component';
import { MatDialog } from '@angular/material';
import { Search } from '../search';
import { SearchResultComponent } from '../search-result/search-result.component';

// Variable for google maps
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // Variables
  private searchCriterias: Search;
  // Currently important position
  public currentLatLng = null;
  //Position of user
  public userLatLng = {
    lat: 0,
    lng: 0
  }
  public currentMarkerLocation: any;
  public locations: Location[] = [];
  public tokenPayload: TokenPayload;
  geocoder: any;
  public selectedLatLng = null;
  public origin: any;
  public destination: any;
  // Different view
  public searchMode: boolean = false;

  constructor(
    public mapsApiLoader: MapsAPILoader,
    public dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly locationRepositoryService: LocationRepositoryService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    public readonly bottomSheet: MatBottomSheet,
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
    this.getCurrentLocation();

    // Get desired places from database
    if (this.searchMode) {
      this.locations = await this.locationRepositoryService.getSeachedLocations(this.searchCriterias);
      //Open seasrch results
      this.openSearchResults();
    } else {
      this.locations = await this.locationRepositoryService.getAll();
    }
  }

  async getCurrentLocation() {
    const location: any = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));

    // Set user position indicator
    this.userLatLng.lat = location.coords.latitude;
    this.userLatLng.lng = location.coords.longitude;

    if (!this.currentLatLng) {
      this.zoomToUserLocation();
    }
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
      }
    }).afterDismissed().toPromise();

    // If add-place component was closed the home component will be initilized to display added marker
    if (dialogWrapper.ref) {
      await dialogWrapper.ref.afterClosed().toPromise();
      this.initializeComponent();
    }
    this.selectedLatLng = null;
  }

  // Transfer coordinates into an address
  async getAddressFromCoordinates(lat, lng): Promise<any> {
    return new Promise((resolve, reject) => {
      let currAddress: string;
      this.geocoder.geocode({
        'location': {
          lat: lat,
          lng: lng
        }
      }, (results) => {
        currAddress = results[0].formatted_address
        resolve(currAddress);
      });
    });
  }

  // Click on marker displays details
  async onMarkerClick(location) {
    this.currentMarkerLocation = location;
    let events = {
      showRouteClicked: false
    };
    await this.bottomSheet.open(SelectMarkerComponent, {
      data: {
        location: location,
        username: this.tokenPayload.username,
        events
      }
    }).afterDismissed().subscribe(async result => {
      if (result) {
        // Focus on location
        this.currentLatLng.lat = location.lat;
        this.currentLatLng.lng = location.lng;
      }
      this.initializeComponent();

      if (events.showRouteClicked) {
        // If search mode is activated get original current location and end search mode
        if (this.searchMode) {
          await this.getCurrentLocation();
          this.searchMode = false;
        }
        this.showRoute(location);
      }
    });
  }

  showRoute(location: Location) {
    this.origin = { lat: this.userLatLng.lat, lng: this.userLatLng.lng };
    this.destination = { lat: location.lat, lng: location.lng };
  }

  onMapReady(e) {
    (window.document.querySelector('agm-map > div') as any).style.height = '100%';
  }

  onEndRoute() {
    this.origin = null;
    this.destination = null;
  }

  async openGoogleMaps() {
    var gmaps = "https://www.google.com/maps/dir/"
    // Get starting point address
    var startingPoint = await this.getAddressFromCoordinates(this.currentLatLng.lat, this.currentLatLng.lng);
    // Get destination address
    var destination = await this.currentMarkerLocation.address;
    var gmapsLink = gmaps + encodeURIComponent(startingPoint) + "/" + encodeURIComponent(destination);
    window.open(gmapsLink, "_blank");
  }

  openSearch(): void {
    let dialogRef = this.dialog.open(SearchComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.valuesSelected) {
        this.searchMode = true;
        this.searchCriterias = result.search;
        this.initializeComponent();
      }
    });
  }

  async openSearchResults() {
    // Open bottem sheet that shows the results of the search
    await this.bottomSheet.open(SearchResultComponent, {
      data: {
        results: this.locations
      },
    }).afterDismissed().subscribe(result => {
      if (result) {
        // Zoom to the selected location
        this.currentLatLng.lat = result.lat;
        this.currentLatLng.lng = result.lng;
      }
    });
  }

  onExitSearchMode() {
    this.searchMode = false;
    this.initializeComponent();
  }

  zoomToUserLocation() {
    if (this.currentLatLng) {
      this.currentLatLng.lng = this.userLatLng.lng;
      this.currentLatLng.lat = this.userLatLng.lat;
    } else {
      this.currentLatLng = Object.assign({}, this.userLatLng);
    }
  }
}
