import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ProjectSearch } from '../../models/project-search';
import { ProjectItemComponent } from '../project-item/project-item.component';

@Component({
  selector: 'app-projects-search-results-filters',
  templateUrl: './projects-search-results-filters.component.html',
  styleUrls: ['./projects-search-results-filters.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatChipsModule, ProjectItemComponent]
})
export class ProjectsSearchResultsFiltersComponent implements OnInit {

  @Input()
  searchFields!: ProjectSearch;
  @Output() RemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
   
  }

  public remove(field: any) {
    this.RemoveSearchField.emit(field);
  }
  public getCategoryName(categoryId: number) {
    // return this.store.select(getCategoryById(categoryId));
  }

  public getDesignerName(designerId: number) {
    // return this.store.select(getDesignerById(designerId));
  }
}
