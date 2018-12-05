import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { API_BASE_URL } from './api-base-url';
import { Comment } from './comment';

@Injectable({
  providedIn: 'root'
})
export class CommentRepositoryService {

  constructor(private readonly httpClient: HttpClient, @Inject(API_BASE_URL) private readonly apiBaseUrl: string, private readonly authService: AuthService) { }

  public async add(comment: Comment): Promise<void> {
    return this.httpClient.post<void>(this.apiBaseUrl + 'comment', comment, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    }).toPromise();
  }

  public async get(location_id: number): Promise<Comment[]> {
    return this.httpClient.get<Comment[]>(this.apiBaseUrl + `comment/${location_id}`, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    }).toPromise();
  }
}
