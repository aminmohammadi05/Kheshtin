import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignOfficeSearch } from 'src/app/models/design-office-search';

@Component({
  selector: 'app-design-offices-search-results-filters',
  templateUrl: './design-offices-search-results-filters.component.html',
  styleUrls: ['./design-offices-search-results-filters.component.css']
})
export class DesignOfficesSearchResultsFiltersComponent implements OnInit {
  @Input() searchFields: DesignOfficeSearch;
  @Output() RemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {

   }

  public remove(field) {
    this.RemoveSearchField.emit(field);
  }
  public trimSearchTerm(searchTerm: string) : string {
    return searchTerm.replace('filter=', '');
  }
 
}
