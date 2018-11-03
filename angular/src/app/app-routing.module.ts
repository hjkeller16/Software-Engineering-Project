import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent
}, {
  path: 'signup',
  component: SignupComponent
}, {
  path: '',
  component: HomeComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
