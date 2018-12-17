import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { Location } from '../location';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {

  //Variable
  public results: Location[];

  constructor(
    private bottomDialogRef: MatBottomSheetRef<SearchResultComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.results = data.results;
  }

  onClickResult(location) {
    this.bottomDialogRef.dismiss(location);
  }

}
