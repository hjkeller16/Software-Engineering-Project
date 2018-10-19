import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { TokenResponse } from '../token-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;

  constructor(private readonly authService: AuthService) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: ''
    }
  }

  async onLogin() {
    try {
      await this.authService.login(this.user);
    } catch (err) {
      window.alert(err.error.error);
    }
  }

  async onRegister() {
    try {
      await this.authService.register(this.user);
    } catch (err) {
      window.alert(err.error.error);
    }
  }

}
