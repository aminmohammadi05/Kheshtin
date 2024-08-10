import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MoodBoardSearch } from 'src/app/models/mood-board-search';

@Component({
  selector: 'app-mood-boards-search-results-filters',
  templateUrl: './mood-boards-search-results-filters.component.html',
  styleUrls: ['./mood-boards-search-results-filters.component.css']
})
export class MoodBoardsSearchResultsFiltersComponent implements OnInit {
  @Input() searchFields: MoodBoardSearch;
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

  public trimSearchTerm(searchTerm: string) : string {
    return searchTerm.replace('filter=', '');
  }
}
