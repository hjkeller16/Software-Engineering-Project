import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { AddPlaceComponent } from './add-place/add-place.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatDialogModule, MatCheckboxModule, MatBadgeModule, MatButtonModule, MatFormFieldModule, MatProgressSpinnerModule, MatGridListModule, MatToolbar, MatToolbarModule, MatBottomSheetModule, MatDialogRef, MatRadioModule, MatCardModule, MatProgressBarModule, MatListModule, MatIconModule } from '@angular/material';
import { API_BASE_URL, apiBaseUrlFactory } from './api-base-url';
import { AgmCoreModule, GoogleMapsScriptProtocol } from '@agm/core';
import { MarkPlaceComponent } from './mark-place/mark-place.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { SelectMarkerComponent } from './select-marker/select-marker.component';
import { AgmDirectionModule } from 'agm-direction'
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { SearchComponent } from './search/search.component';
import { Base64Pipe } from './base64.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
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
  providers: [{
    provide: API_BASE_URL,
    useFactory: apiBaseUrlFactory
  }],
  bootstrap: [AppComponent],
  entryComponents: [
    AddPlaceComponent,
    MarkPlaceComponent,
    SearchComponent,
    SelectMarkerComponent,
    SearchResultComponent
  ]
})
export class AppModule { }
