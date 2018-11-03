import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { TokenResponse } from './token-response';
import { User } from './user';
import { TokenPayload } from './token-payload';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends EventEmitter<TokenPayload> {

  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  private getApiUrl(): string {
    return environment.production ? `${location.protocol}//${location.host}/auth` : 'http://localhost:3000/auth';
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getToken(): string {
    return localStorage.getItem('token');
  }

  private async emitPayload(): Promise<void> {
    try {
      const tokenPayload: TokenPayload = await this.payload();

      this.emit(tokenPayload);
    } catch (err) {
      this.emit(null);
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !!await this.payload();
  }

  public logout(): void {
    localStorage.clear();
    this.emitPayload();
  }

  public async register(user: User): Promise<void> {
    const response = await this.httpClient.post<TokenResponse>(this.getApiUrl() + '/register', user).toPromise();
    this.setToken(response.token);
    this.emitPayload();
  }

  public async login(user: User): Promise<void> {
    const response = await this.httpClient.post<TokenResponse>(this.getApiUrl() + '/login', user).toPromise();
    this.setToken(response.token);
    this.emitPayload();
  }

  public async payload(): Promise<TokenPayload> {
    if (!this.getToken()) {
      return null;
    }

    return this.httpClient.get<TokenPayload>(this.getApiUrl() + '/payload', {
      headers: {
        Authorization: 'Bearer ' + this.getToken()
      }
    }).toPromise();
  }
}
