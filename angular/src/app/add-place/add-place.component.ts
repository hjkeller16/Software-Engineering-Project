import { Component, Inject } from '@angular/core';
import { LocationRepositoryService } from '../location-repository.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.css']
})
export class AddPlaceComponent {

  public location = {
    id: undefined,
    category: 'Fußball', //Default category
    name: '',
    description: '',
    address: '',
    city: '',
    lat: 0,
    lng: 0,
    user_id: ''
  }

  constructor(private readonly locationRepositoryService: LocationRepositoryService,
    private readonly router: Router,
    public readonly dialogRef: MatDialogRef<AddPlaceComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    console.log()
    this.location.lat = data.lat;
    this.location.lng = data.lng;
    this.location.address = data.address;
    // Navigate back to home component
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['']);
    });
  }

  async onAddPlace() {
    await this.locationRepositoryService.add(this.location);
    this.dialogRef.close();
  }
}
