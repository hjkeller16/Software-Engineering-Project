import { Component, Inject } from '@angular/core';
import { LocationRepositoryService } from '../location-repository.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

//Inner class
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

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
    lat: 0,
    lng: 0,
    user_id: '',
    image: undefined,
    avgrating: 0
  }
  public isLoading: boolean = false;
  selectedFile: ImageSnippet = null;;

  constructor(
    private readonly locationRepositoryService: LocationRepositoryService,
    private readonly router: Router,
    public readonly dialogRef: MatDialogRef<AddPlaceComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.location.lat = data.lat;
    this.location.lng = data.lng;
    this.location.address = data.address;
    // Navigate back to home component
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['']);
    });
  }

  async onAddPlace() {
    this.isLoading = true;
    await this.locationRepositoryService.add(this.location);
    this.dialogRef.close();
    this.isLoading = false;
  }

  async processFile(imageInput: any) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageInput.files[0])
    await new Promise((res, rej) => {
      fileReader.onloadend = res;
      fileReader.onerror = rej;
    });
    this.location.image = fileReader.result;
  }
}
