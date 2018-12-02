import { Component, Inject, NgZone } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { CommentRepositoryService } from '../comment-repository.service';
import { Comment } from '../comment';
import { LocationRepositoryService } from '../location-repository.service';


@Component({
  selector: 'app-select-marker',
  templateUrl: './select-marker.component.html',
  styleUrls: ['./select-marker.component.css']
})
export class SelectMarkerComponent {
  //Variables
  comment: Comment = {
    rating: 0,
    content: '',
    location_id: ''
  };

  constructor(
    private readonly commentRepositoryService: CommentRepositoryService,
    private readonly locationRepositoryService: LocationRepositoryService,
    private readonly ngZone: NgZone,
    private readonly bottomDialogRef: MatBottomSheetRef<SelectMarkerComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    console.log(data);
    this.comment.location_id = data.location.id;
  }

  onShowRoute() {
    this.bottomDialogRef.dismiss();
    this.data.events.showRouteClicked = true;
  }

  title = 'Star Rating';
  // create a list which contains status of 5 stars
  starList: boolean[] = [true, true, true, true, true];
  //Function which receives the value counting of stars click, 
  //and according to that value we do change the value of that star in list.
  setStar(data: any) {
    this.comment.rating = data + 1;
    for (var i = 0; i <= 4; i++) {
      if (i <= data) {
        this.starList[i] = false;
      }
      else {
        this.starList[i] = true;
      }
    }
  }

  async onComment() {
    try {
      await this.commentRepositoryService.add(this.comment);
    } catch (err) {
      console.log('Error: ' + err);
    }
    this.bottomDialogRef.dismiss();
  }

  async onDeleteLocation() {
    try {
      await this.locationRepositoryService.delete(this.data.location.id);
    } catch (err) {
      console.log('Error' + err);
    }
    this.bottomDialogRef.dismiss();
  }
}
