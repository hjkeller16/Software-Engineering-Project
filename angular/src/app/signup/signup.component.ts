import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private readonly authService: AuthService, public router: Router) { }

  user: User;

  ngOnInit() {
    this.user = {
      username: '',
      password: ''
    }
  }

  async onRegister() {
    try {
      await this.authService.register(this.user);
      this.router.navigate(['']);
    } catch (err) {
      window.alert(err.error.error);
    }
  }

}
