import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventSearch } from 'src/app/models/event-search';

@Component({
  selector: 'app-events-search-results-filters',
  templateUrl: './events-search-results-filters.component.html',
  styleUrls: ['./events-search-results-filters.component.css']
})
export class EventsSearchResultsFiltersComponent implements OnInit {

  @Input() searchFields: EventSearch;
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
