import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BlogSearch } from '../../models/blog-search';

@Component({
  selector: 'app-blogs-search-results-filters',
  templateUrl: './blogs-search-results-filters.component.html',
  styleUrls: ['./blogs-search-results-filters.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule,  ],
})
export class BlogsSearchResultsFiltersComponent implements OnInit {
  @Input()
  searchFields!: BlogSearch;
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

  public trimSearchTerm(searchTerm: string) : string {
    return searchTerm.replace('filter=', '');
  }
}
