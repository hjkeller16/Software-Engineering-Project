import { Component, Inject } from '@angular/core';
import { AddPlaceComponent } from '../add-place/add-place.component';
import { MatDialog, MatBottomSheetRef } from '@angular/material';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-mark-place',
  templateUrl: './mark-place.component.html',
  styleUrls: ['./mark-place.component.css']
})
export class MarkPlaceComponent {

  constructor(
    private bottomDialogRef: MatBottomSheetRef<MarkPlaceComponent>,
    private readonly dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  onAddPlace() {
    this.bottomDialogRef.dismiss();
    this.data.dialogWrapper.ref = this.dialog
      .open(AddPlaceComponent, {
        autoFocus: true,
        data: {
          lat: this.data.lat,
          lng: this.data.lng,
          address: this.data.address
        },
        panelClass: 'add-place-dialog-panel'
      });
  }
}
