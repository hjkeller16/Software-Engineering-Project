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
  //New comment
  comment: Comment = {
    rating: 0,
    content: '',
    location_id: ''
  };
  //All comments
  comments: Comment[] = [];
  public location: Location = undefined;
  public imageLoading: boolean = location ? true : false;
  // create a list which contains status of 5 stars
  starList: boolean[] = [true, true, true, true, true];
  starListAverage: boolean[] = [true, true, true, true, true];

  constructor(
    private readonly commentRepositoryService: CommentRepositoryService,
    private readonly locationRepositoryService: LocationRepositoryService,
    private readonly bottomDialogRef: MatBottomSheetRef<SelectMarkerComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.comment.location_id = data.location.id;
    this.getLocation(data.location.id, data);
    this.getComments(data.location.id);
    this.setStarAverage(data.location.avgrating - 1);
    this.setStar(-1);
  }

  async getLocation(locationId: number, data: any) {
    this.location = await this.locationRepositoryService.get(locationId);
    data.location.image = this.location.image;
    this.imageLoading = false;
  }

  async getComments(locationId) {
    this.comments = await this.commentRepositoryService.get(locationId);
  }

  onShowRoute() {
    this.bottomDialogRef.dismiss();
    this.data.events.showRouteClicked = true;
  }

  //Sets the avarage rating of this location
  setStarAverage(data: any) {
    this.comment.rating = data + 1;
    for (var i = 0; i <= 4; i++) {
      if (i <= data) {
        this.starListAverage[i] = false;
      }
      else {
        this.starListAverage[i] = true;
      }
    }
  }

  //Function which receives the value counting of stars click, 
  //and according to that value we do change the value of that star in list.
  setStar(data: any) {
    if (this.comment.rating !== 0 && data === 0) {
      data = -1;
    }
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

  //Saves comment in database
  async onComment() {
    try {
      await this.commentRepositoryService.add(this.comment);
    } catch (err) {
      console.log('Error: ' + err);
    }
    // Set variable focusOnLocation true
    let focusOnLocation = true;
    this.bottomDialogRef.dismiss(focusOnLocation);
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
