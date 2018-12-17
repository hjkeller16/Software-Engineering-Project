import { Injectable } from '@angular/core';
import { User } from './user';
import { TokenPayload } from './token-payload';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {

  private loggedIn: boolean = false;

  public login(user: User): void {
    if (user.username === "testUser" && user.password === "testPassword") {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  public payload() {
    return {
      username: "testUser",
      iat: "1471566154",
      exp: "1624575422"
    };
  }
}
