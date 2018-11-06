import { Component, OnInit } from '@angular/core';
import { Location } from '../location';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationRepositoryService } from '../location-repository.service';

declare const google;

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.css']
})
export class AddPlaceComponent {

  constructor(private readonly locationRepositoryService: LocationRepositoryService, private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {
    this.activatedRoute.params.subscribe((params) => {
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
      const [, lat, lng] = /LatLng\((.*), (.*)\)/.exec(params.latlng);
      this.location.lat = Number(lat) || 0;
      this.location.lng = Number(lng) || 0;
      google.maps.event.addDomListener(window, 'load', this.initialize);
    })
  }

  location: Location;
  private geocoder;

  codeLatLng(lat, lng) {
    let latlng = new google.maps.LatLng(lat, lng);
    this.geocoder.geocode({
      'latLng': latlng
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log(results[1]);
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }

  initialize() {
    this.geocoder = new google.maps.Geocoder();
  }

  async onAddPlace() {
    await this.locationRepositoryService.add(this.location);
    this.router.navigate(['']);
  }



}
