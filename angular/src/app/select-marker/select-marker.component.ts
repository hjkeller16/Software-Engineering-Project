import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '../location';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-select-marker',
  templateUrl: './select-marker.component.html',
  styleUrls: ['./select-marker.component.css']
})
export class SelectMarkerComponent {

  constructor(
    private bottomDialogRef: MatBottomSheetRef<SelectMarkerComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { console.log(data); }

}
