import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '../location';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationRepositoryService } from '../location-repository.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.css']
})
export class AddPlaceComponent {

  public location = {
    id: '',
    category: '',
    name: '',
    description: '',
    address: '',
    city: '',
    lat: 0,
    lng: 0
  }

  public form = new FormGroup({
    name: new FormControl(this.location.name, Validators.required),
    address: new FormControl(this.location.address, Validators.required),
    description: new FormControl(this.location.description),
    soccer: new FormControl(false),
    tabletennis: new FormControl(false),
    basketball: new FormControl(false),
    otherCategory: new FormControl('')
  })

  constructor(private readonly locationRepositoryService: LocationRepositoryService, public readonly dialogRef: MatDialogRef<AddPlaceComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    console.log()
    const [, lat, lng] = /LatLng\((.*), (.*)\)/.exec(data.latlng);
    this.location.lat = Number(lat) || 0;
    this.location.lng = Number(lng) || 0;
  }

  async onAddPlace() {
    await this.locationRepositoryService.add(this.location);
    this.dialogRef.close();
  }
}
