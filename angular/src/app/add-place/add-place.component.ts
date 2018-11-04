import { Component, OnInit } from '@angular/core';
import { Location } from '../location';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationRepositoryService } from '../location-repository.service';

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
      debugger;
      const [, lat, lng] = /LatLng\((.*), (.*)\)/.exec(params.latlng);
      this.location.lat = Number(lat) || 0;
      this.location.lng = Number(lng) || 0;
    })
  }

  location: Location;

  async onAddPlace() {
    await this.locationRepositoryService.add(this.location);
    this.router.navigate(['']);
  }



}
