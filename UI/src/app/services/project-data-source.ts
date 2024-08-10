import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { ProjectService } from './project.service';
import { Project } from '../models/project';
import { catchError, finalize } from 'rxjs/operators';
import { PaginatedResult } from '../models/pagination';
import { CollectionViewer } from '@angular/cdk/collections';
import { AuthService } from './auth.service';

export class ProjectDataSource implements DataSource<Project> {
    ProjectList: Project[] = [];
    private ProjectsSubject = new BehaviorSubject<Project[]>([]);
    private paginationSubject = new BehaviorSubject<number>(0);
    private currentPageSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public projectList$ = this.ProjectsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public currentPage$ = this.paginationSubject.asObservable();

    constructor(private projectService: ProjectService,
                private authService: AuthService) {

    }

    loadProjects( term: string, designerId: string[], categories: string[], pageIndex: number,
                  pageSize: number) {

    this.loadingSubject.next(true);

    this.projectService.getProjects(term, designerId, categories, pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
    )
    .subscribe((Projects: PaginatedResult<Project[]>) => {
        if (Projects) {
            this.ProjectList = Projects.result;
            this.ProjectsSubject.next(Projects.result);
            this.paginationSubject.next(Projects.pagination.totalItems);
            this.currentPageSubject.next(Projects.pagination.currentPage);
        }
    });
}

    connect(collectionViewer: CollectionViewer): Observable<Project[]> {
        
        return this.ProjectsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.ProjectsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
        this.currentPageSubject.complete();
    }

}
