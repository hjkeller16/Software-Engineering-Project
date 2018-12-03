import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { CommentRepositoryService } from '../comment-repository.service';
import { Comment } from '../comment';
import { LocationRepositoryService } from '../location-repository.service';
import { Location } from '../location';

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
  public location: Location = undefined;
  public imageLoading: boolean = location ? true : false;

  constructor(
    private readonly commentRepositoryService: CommentRepositoryService,
    private readonly locationRepositoryService: LocationRepositoryService,
    private readonly bottomDialogRef: MatBottomSheetRef<SelectMarkerComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    console.log(data);
    this.comment.location_id = data.location.id;
    this.getLocation(data.location.id, data);
    //Anna please change 0=1Stern, sollte aber mit dem abspeichern in der DB automatisch passens
    this.setStarA(4);
  }

  async getLocation(locationId: number, data: any) {
    this.location = await this.locationRepositoryService.get(locationId);
    data.location.image = this.location.image;
    this.imageLoading = false;
  }

  onShowRoute() {
    this.bottomDialogRef.dismiss();
    this.data.events.showRouteClicked = true;
  }

  //title = 'Star Rating';
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

  title = 'Star Rating';
  // create a list which contains status of 5 stars
  starListA: boolean[] = [true, true, true, true, true];
  //Function which receives the value counting of stars click, 
  //and according to that value we do change the value of that star in list.
  setStarA(data: any) {
    this.comment.rating = data + 1;
    for (var i = 0; i <= 4; i++) {
      if (i <= data) {
        this.starListA[i] = false;
      }
      else {
        this.starListA[i] = true;
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
