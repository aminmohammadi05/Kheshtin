import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MoodBoardSearch } from 'src/app/models/mood-board-search';
import { CategoriesComponent } from 'src/app/pages/categories/categories.component';

@Component({
  selector: 'app-mood-boards-search-results-filters',
  templateUrl: './mood-boards-search-results-filters.component.html',
  styleUrls: ['./mood-boards-search-results-filters.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatListModule ]
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
