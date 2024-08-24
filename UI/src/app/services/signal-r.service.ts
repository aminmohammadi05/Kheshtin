import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ProjectComment } from '../models/project-comment';
import { ProjectAdminReply } from '../models/project-admin-reply';
// import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
providedIn: 'root'
})
export class SignalRService {
baseUrl = environment.apiUrl;
public projectsComment: ProjectComment[] = [];
public projectsAdminReplies: ProjectAdminReply[] = [];

constructor(
    // private authService: AuthService, 
    private http: HttpClient) {}

private commentsDataSource = new BehaviorSubject(this.projectsComment);
commentsCurrentData = this.commentsDataSource.asObservable();

private adminRepliesDataSource = new BehaviorSubject(this.projectsAdminReplies);
adminRepliesCurrentData = this.adminRepliesDataSource.asObservable();

private hubConnection!: signalR.HubConnection;

public startConnection(): Observable<signalR.HubConnection> {
this.hubConnection = new signalR.HubConnectionBuilder()
.withUrl(this.baseUrl + 'chartbase') //, { accessTokenFactory: () => this.authService.getJwtToken() })
.build();

this.hubConnection
.start()
.then(() => console.log('Connection started'))
.catch(err => console.log('Error while starting connection: ' + err));

return of(this.hubConnection);
}

public addProjectsCommentListener(): Observable<signalR.HubConnection> {
this.hubConnection.on('transferapprovedcommentsdata', (data: ProjectComment[]) => {
this.projectsComment = data;
this.commentsDataSource.next(data);
});
return of(this.hubConnection);
}

public addAdminRepliesListener(): Observable<signalR.HubConnection> {
this.hubConnection.on('transferadminapproveddata', (data: ProjectAdminReply[]) => {
this.projectsAdminReplies = data;
this.adminRepliesDataSource.next(data);
});
return of(this.hubConnection);
}

public getProjectUnreadComments(token: string, userId: number): Observable<any> {
return this.http.get<any>(`${environment.apiUrl}chart/GetProjectsApprovedUnreadComments/${userId}`, {
headers: { 'Authorization': 'Bearer ' + token }
});
}

public getProjectAdminReplies(token: string, userId: number): Observable<any> {
return this.http.get<any>(`${environment.apiUrl}chart/GetProjectsAdminReplies/${userId}`, {
headers: { 'Authorization': 'Bearer ' + token }
});
}
}