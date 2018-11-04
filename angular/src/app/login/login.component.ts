import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private readonly authService: AuthService, public router: Router) { }

  ngOnInit() {
    this.user = {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    }
  }

  async onLogin() {
    try {
      await this.authService.login(this.user);
      this.router.navigate(['']);
    } catch (err) {
      window.alert(err.error.error);
    }
  }

  async onSignUp() {
    this.router.navigate(['signup']);
  }

}
