import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrandSearch } from 'src/app/models/brand-search';

@Component({
  selector: 'app-brands-search-results-filters',
  templateUrl: './brands-search-results-filters.component.html',
  styleUrls: ['./brands-search-results-filters.component.css']
})
export class BrandsSearchResultsFiltersComponent implements OnInit {
  @Input() searchFields: BrandSearch;
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
