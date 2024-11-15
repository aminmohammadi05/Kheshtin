import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'actions' ];
  dataSource = new MatTableDataSource<Project>();
  userProjects: Project[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public appService: AppService,
              public authService: AuthService) { }

  ngOnInit() {
    // this.store.pipe(select(getAllMyProjects(+this.authService.getDecodedToken().nameid)),
    // map((userProjects) => {
    //   if (userProjects.length > 0) {
    //     this.userProjects = userProjects;
    //     this.dataSource.data = this.userProjects;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   } else {
    //     this.store.dispatch(new RefreshUserProjectRequest(this.authService.getDecodedToken().nameid));
    //   }
    //   return of(this.userProjects);
    // })).subscribe();
  }

  public remove(project: Project) {
    // this.store.dispatch(new RequestUserProjectRemove(project.projectId, this.authService.getDecodedToken().nameid));
    // if (this.userProjects.length === 1) {
    //   this.userProjects = [];
    //   this.dataSource.data = this.userProjects;
    // }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
