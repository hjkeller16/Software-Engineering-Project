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
import { MatInputModule, MatDialogModule, MatCheckboxModule, MatBadgeModule, MatButtonModule, MatFormFieldModule, MatProgressSpinnerModule, MatGridListModule, MatToolbarModule, MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { API_BASE_URL, apiBaseUrlFactory } from '../api-base-url';
import { AgmCoreModule } from '@agm/core';
import { MarkPlaceComponent } from '../mark-place/mark-place.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { SelectMarkerComponent } from '../select-marker/select-marker.component';
import { AgmDirectionModule } from 'agm-direction'
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

describe('MarkPlaceComponent', () => {
  let component: MarkPlaceComponent;
  let fixture: ComponentFixture<MarkPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        SignupComponent,
        AddPlaceComponent,
        MarkPlaceComponent,
        SelectMarkerComponent
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
        MatProgressSpinnerModule,
        MatGridListModule,
        MatToolbarModule,
        MatBottomSheetModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyAPN8BwmAlGH29eT-u1UHYcE7sj4tJFSg4'
        }),
        AgmJsMarkerClustererModule,
        AgmDirectionModule,
        ScrollDispatchModule
      ],
      providers: [{
        provide: API_BASE_URL,
        useFactory: apiBaseUrlFactory
      },
      { provide: MatBottomSheetRef, useValue: {} },
      { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let bottomDialogRef: MatBottomSheetRef<MarkPlaceComponent>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
