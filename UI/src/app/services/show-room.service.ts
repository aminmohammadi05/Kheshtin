import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Statistics } from '../models/statistics';
import { UserMoodBoard } from '../models/user-moodboard';
import { TextureShowRoom } from '../models/texture-show-room';

@Injectable({
  providedIn: 'root'
})
export class ShowRoomService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }
    createShowRoomAuth(userId, showRoom: TextureShowRoom): Observable<TextureShowRoom> {

    return this.http.post<TextureShowRoom>(this.baseUrl + `users/${userId}/showroom/CreateTextureShowRoom/`, showRoom);
    }
}
