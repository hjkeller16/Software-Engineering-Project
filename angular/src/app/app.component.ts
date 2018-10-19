import { Component, OnChanges, SimpleChanges, DoCheck, OnInit } from '@angular/core';
import { TokenPayload } from './token-payload';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Software-Engineering-Project';
  tokenPayload?: TokenPayload;

  constructor(private readonly authService: AuthService) { }

  async ngOnInit() {
    this.authService.subscribe((tokenPayload: TokenPayload) => {
      this.tokenPayload = tokenPayload;
    });

    try {
      const tokenPayload: TokenPayload = await this.authService.payload();

      this.tokenPayload = tokenPayload;

    } catch (err) {
      this.tokenPayload = null;
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
