import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, Inject } from '@angular/core';
import { TokenResponse } from './token-response';
import { User } from './user';
import { TokenPayload } from './token-payload';
import { API_BASE_URL } from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends EventEmitter<TokenPayload> {

  constructor(private readonly httpClient: HttpClient, @Inject(API_BASE_URL) private readonly apiBaseUrl: string) {
    super();
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private async emitPayload(): Promise<void> {
    try {
      const tokenPayload: TokenPayload = await this.payload();

      this.emit(tokenPayload);
    } catch (err) {
      this.emit(null);
    }
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    try {
      return !!await this.payload();
    } catch (err) {
      return false;
    }
  }

  public logout(): void {
    localStorage.clear();
    this.emitPayload();
  }

  public async register(user: User): Promise<void> {
    const response = await this.httpClient.post<TokenResponse>(this.apiBaseUrl + '/auth/register', user).toPromise();
    this.setToken(response.token);
    this.emitPayload();
  }

  public async login(user: User): Promise<void> {
    const response = await this.httpClient.post<TokenResponse>(this.apiBaseUrl + '/auth/login', user).toPromise();
    this.setToken(response.token);
    this.emitPayload();
  }

  public async payload(): Promise<TokenPayload> {
    if (!this.getToken()) {
      return null;
    }

    return this.httpClient.get<TokenPayload>(this.apiBaseUrl + '/auth/payload', {
      headers: {
        Authorization: 'Bearer ' + this.getToken()
      }
    }).toPromise();
  }
}
