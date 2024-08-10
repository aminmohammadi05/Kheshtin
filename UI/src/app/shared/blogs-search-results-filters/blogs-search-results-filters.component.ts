import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogSearch } from 'src/app/models/blog-search';

@Component({
  selector: 'app-blogs-search-results-filters',
  templateUrl: './blogs-search-results-filters.component.html',
  styleUrls: ['./blogs-search-results-filters.component.css']
})
export class BlogsSearchResultsFiltersComponent implements OnInit {
  @Input() searchFields: BlogSearch;
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
