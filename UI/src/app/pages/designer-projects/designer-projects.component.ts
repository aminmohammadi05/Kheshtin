import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Project } from '../../models/project';
import { AuthService } from '../../services/auth.service';
import { ProjectDataSource } from '../../services/project-data-source';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-designer-projects',
  templateUrl: './designer-projects.component.html',
  styleUrls: ['./designer-projects.component.css']
})
export class DesignerProjectsComponent implements OnInit, AfterViewInit {
  projectList: Project[] = [];
  dataSource!: ProjectDataSource;
  designerId!: number;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('input')
  input!: ElementRef;
  constructor(private route: ActivatedRoute,
              private routeService: Router,
              public authService: AuthService,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.designerId = params['userId'];
      this.dataSource = new ProjectDataSource(this.projectService, this.authService);
      this.dataSource.loadProjects('filter=', [this.designerId.toString()], ['empty'] , 0, 3);
  });
  }

  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.getProjects();
            })
        )
        .subscribe();
    merge(this.paginator.page)
    .pipe(
        tap(() => this.getProjects())
    )
    .subscribe();
}

getProjects() {
  this.dataSource.loadProjects('filter=' + this.input.nativeElement.value,
     [this.designerId.toString()], ['empty'], this.paginator.pageIndex + 1,
     this.paginator.pageSize);
  }

  openNewProject() {
    this.routeService.navigate(['/account/insertproject']);
  }
}
