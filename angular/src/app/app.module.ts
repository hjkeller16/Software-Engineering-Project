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
import { MatInputModule, MatDialogModule, MatCheckboxModule, MatBadgeModule, MatButtonModule, MatFormFieldModule, MatProgressSpinnerModule, MatGridListModule, MatToolbar, MatToolbarModule, MatBottomSheetModule, MatDialogRef } from '@angular/material';
import { API_BASE_URL, apiBaseUrlFactory } from './api-base-url';
import { AgmCoreModule } from '@agm/core';
import { MarkPlaceComponent } from './mark-place/mark-place.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    AddPlaceComponent,
    MarkPlaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
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
    AgmJsMarkerClustererModule
  ],
  providers: [{
    provide: API_BASE_URL,
    useFactory: apiBaseUrlFactory
  }],
  bootstrap: [AppComponent],
  entryComponents: [
    AddPlaceComponent,
    MarkPlaceComponent
  ]
})
export class AppModule { }
