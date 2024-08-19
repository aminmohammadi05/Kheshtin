import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { OfficeProjectSearch } from 'src/app/models/office-project-search';

@Component({
  selector: 'app-office-projects-search-results-filters',
  templateUrl: './office-projects-search-results-filters.component.html',
  styleUrls: ['./office-projects-search-results-filters.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatChipsModule]
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
