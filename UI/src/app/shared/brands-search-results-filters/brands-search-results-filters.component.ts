import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { BrandSearch } from '../../models/brand-search';

@Component({
  selector: 'app-brands-search-results-filters',
  templateUrl: './brands-search-results-filters.component.html',
  styleUrls: ['./brands-search-results-filters.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule,  ],
})
export class BrandsSearchResultsFiltersComponent implements OnInit {
  @Input()
  searchFields!: BrandSearch;
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
