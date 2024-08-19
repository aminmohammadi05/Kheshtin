import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventSearch } from 'src/app/models/event-search';

@Component({
  selector: 'app-events-search-results-filters',
  templateUrl: './events-search-results-filters.component.html',
  styleUrls: ['./events-search-results-filters.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule],
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
