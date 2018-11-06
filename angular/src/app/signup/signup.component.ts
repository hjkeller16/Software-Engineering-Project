import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { matchValidator } from '../match-validator.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  user: User;

  registerForm = new FormGroup({
    email: new FormControl(''),
    emailWdh: new FormControl(''),
    password: new FormControl(''),
    passwordWdh: new FormControl('')
  }, { validators: matchValidator });

  ngOnInit() {
    this.user = {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
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
