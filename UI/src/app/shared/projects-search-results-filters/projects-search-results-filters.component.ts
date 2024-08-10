import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectSearch } from 'src/app/models/project-search';

@Component({
  selector: 'app-projects-search-results-filters',
  templateUrl: './projects-search-results-filters.component.html',
  styleUrls: ['./projects-search-results-filters.component.css']
})
export class ProjectsSearchResultsFiltersComponent implements OnInit {

  @Input() searchFields: ProjectSearch;
  @Output() RemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
   
  }

  public remove(field) {
    this.RemoveSearchField.emit(field);
  }
  public getCategoryName(categoryId: number) {
    // return this.store.select(getCategoryById(categoryId));
  }

  public getDesignerName(designerId: number) {
    // return this.store.select(getDesignerById(designerId));
  }
}
