import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Project } from '../../../models/project';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule, MatChipsModule, MatListModule, MatFormFieldModule, MatPaginatorModule],
})
export class MyProjectsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'actions' ];
  dataSource = new MatTableDataSource<Project>();
  userProjects: Project[] = [];
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  public authService = inject(AuthService);
  constructor(
              ) { }

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
