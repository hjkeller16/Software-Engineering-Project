import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';


@Component({
  selector: 'app-select-marker',
  templateUrl: './select-marker.component.html',
  styleUrls: ['./select-marker.component.css']
})
export class SelectMarkerComponent {
  

  constructor(
    private readonly bottomDialogRef: MatBottomSheetRef<SelectMarkerComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { console.log(data); }

  onShowRoute() {
    this.bottomDialogRef.dismiss();
    this.data.events.showRouteClicked = true;
  }
}
