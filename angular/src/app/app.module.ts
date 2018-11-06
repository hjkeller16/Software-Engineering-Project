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
import { API_BASE_URL, apiBaseUrlFactory } from './api-base-url';
import { MatchValidatorDirective } from './match-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    AddPlaceComponent,
    MatchValidatorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: API_BASE_URL,
    useFactory: apiBaseUrlFactory
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
