import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DesignOfficeSearch } from '../../models/design-office-search';

@Component({
  selector: 'app-design-offices-search-results-filters',
  templateUrl: './design-offices-search-results-filters.component.html',
  styleUrls: ['./design-offices-search-results-filters.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule],
})
export class DesignOfficesSearchResultsFiltersComponent implements OnInit {
  @Input()
  searchFields!: DesignOfficeSearch;
  @Output() RemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {

   }

  public remove(field: any) {
    this.RemoveSearchField.emit(field);
  }
  public trimSearchTerm(searchTerm: string) : string {
    return searchTerm.replace('filter=', '');
  }
 
}
