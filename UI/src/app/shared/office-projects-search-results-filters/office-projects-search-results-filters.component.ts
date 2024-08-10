import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OfficeProjectSearch } from 'src/app/models/office-project-search';

@Component({
  selector: 'app-office-projects-search-results-filters',
  templateUrl: './office-projects-search-results-filters.component.html',
  styleUrls: ['./office-projects-search-results-filters.component.css']
})
export class OfficeProjectsSearchResultsFiltersComponent implements OnInit {

  @Input() searchFields: OfficeProjectSearch;
  @Output() RemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {

  }

  public remove(field) {
    this.RemoveSearchField.emit(field);
  }


  public getDesignerName(designerId: number) {
    // return this.store.select(getDesignOfficeById(designerId));
  }

  public trimSearchTerm(searchTerm: string) : string {
    return searchTerm.replace('filter=', '');
  }
}
