import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Search } from 'src/app/models/search';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-properties-search-results-filters',
  templateUrl: './properties-search-results-filters.component.html',
  styleUrls: ['./properties-search-results-filters.component.scss']
})
export class PropertiesSearchResultsFiltersComponent implements OnInit {
  @Input() searchFields: Search;
  @Output() RemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  public allFileTypes: any[] = [
    {label: 'تصاویر', id: 1},
    {label: 'اشیا', id: 2},
    {label: 'بافت ها', id: 3},
    {label: 'کاتالوگ', id: 4},
    {label: 'اطلاعات فنی', id: 5}
];
  constructor() {
   }

  ngOnInit() {
   }

  public remove(field) {
    this.RemoveSearchField.emit(field);
  }

  public getFileTypeName(fileTypeId: number) {
    return this.allFileTypes.filter(x => x.id === fileTypeId)[0];
  }

  public trimSearchTerm(searchTerm: string) : string {
    return searchTerm.replace('filter=', '');
  }

}
