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

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  user: User;

  ngOnInit() {
    this.user = {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      emailWdh: '',
      password: '',
      passwordWdh: ''
    }
  }

  async onRegister() {
    var inputFalse =""; 
    var stop;
    if(this.user.email != this.user.emailWdh)
    {
      inputFalse = "Die Emails stimmen nicht überein.\n";
      stop = true;
    }
    if(this.user.password != this.user.passwordWdh)
    {
      inputFalse += "Die Password stimmen nicht überein";
      stop = true;
    }
    if(stop!=true)
    {
      try {
        await this.authService.register(this.user);
        this.router.navigate(['']);
      } catch (err) {
        window.alert(err.error.error);
      }
    }
    else
    {
      window.alert(inputFalse);
    }
  }
  async back() {
    this.router.navigate(['login']);
  }

}
