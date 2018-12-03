import { Component, OnInit } from '@angular/core';
import { Search } from '../search';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  //Variables
  public search: Search = {
    address: '',
    categories: []
  }
  fussballChecked: boolean = false;
  tischtennisChecked: boolean = false;
  basketballChecked: boolean = false;

  constructor(public readonly dialogRef: MatDialogRef<SearchComponent>) { }

  onClose() {
    this.dialogRef.close(false);
  }

  async onSearch() {
    // Add selected values to categories
    if (this.fussballChecked) {
      this.search.categories.push("Fußball");
    }
    if (this.tischtennisChecked) {
      this.search.categories.push("Tischtennis");
    }
    if (this.basketballChecked) {
      this.search.categories.push("Basketball");
    }
    // Check if any values were selected
    if (this.search.address === '' && this.search.categories.length === 0) {
      // No values have been selected
      this.dialogRef.close(false);
    } else {
      // Values have been selected an searchMode is true
      this.dialogRef.close({ valuesSelected: true, search: this.search });
    }
  }

}
