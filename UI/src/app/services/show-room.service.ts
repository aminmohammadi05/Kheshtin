import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Statistics } from '../models/statistics';
import { UserMoodBoard } from '../models/user-moodboard';
import { TextureShowRoom } from '../models/texture-show-room';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShowRoomService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  constructor() { }
    createShowRoomAuth(userId: undefined, showRoom: TextureShowRoom): Observable<TextureShowRoom> {

    return this.http.post<TextureShowRoom>(this.baseUrl + `users/${userId}/showroom/CreateTextureShowRoom/`, showRoom);
    }
}
