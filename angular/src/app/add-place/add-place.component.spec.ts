import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { SignupComponent } from '../signup/signup.component';
import { AddPlaceComponent } from '../add-place/add-place.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatCheckboxModule, MatBadgeModule, MatButtonModule, MatFormFieldModule, MatProgressSpinnerModule, MatGridListModule, MatToolbarModule, MatBottomSheetModule, MatRadioModule, MatCardModule, MatListModule, MatIconModule, MatProgressBarModule, MatExpansionModule } from '@angular/material';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { API_BASE_URL, apiBaseUrlFactory } from '../api-base-url';
import { AgmCoreModule, GoogleMapsScriptProtocol } from '@agm/core';
import { MarkPlaceComponent } from '../mark-place/mark-place.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { SelectMarkerComponent } from '../select-marker/select-marker.component';
import { AgmDirectionModule } from 'agm-direction'
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { SearchComponent } from '../search/search.component';
import { Base64Pipe } from '../base64.pipe';
import { SearchResultComponent } from '../search-result/search-result.component';

describe('AddPlaceComponent', () => {
  let component: AddPlaceComponent;
  let fixture: ComponentFixture<AddPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        SignupComponent,
        AddPlaceComponent,
        MarkPlaceComponent,
        SelectMarkerComponent,
        SearchComponent,
        Base64Pipe,
        SearchResultComponent
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        MatInputModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatBadgeModule,
        MatButtonModule,
        MatFormFieldModule,
        MatRadioModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        MatExpansionModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyAPN8BwmAlGH29eT-u1UHYcE7sj4tJFSg4',
          protocol: GoogleMapsScriptProtocol.HTTPS
        }),
        AgmJsMarkerClustererModule,
        AgmDirectionModule,
        ScrollDispatchModule
      ],
      providers: [
        {
          provide: API_BASE_URL,
          useFactory: apiBaseUrlFactory,
        },
        {
          provide: MatDialogRef, useValue: {
            //afterClosed: (dialogResult: any) => { }
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
