import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { log } from 'console';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  /** The total number of records */
  @Output() PageChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  collectionSize = 0;

  /** The number of records to display */
  @Input()
  pageSize = 5;

  /** Current page */
  @Input()
  currentPage = 1;

  /** The number of buttons to show either side of the current page */
  @Input()
  maxSize = 2;

  /** Display the First/Last buttons */
  @Input()
  firstLastButtons = false;

  /** Display the Next/Previous buttons */
  @Input()
  nextPreviousButtons = true;

  /** Display small pagination buttons */
  @Input()
  small = false;

  totalPages: any[] = [];

  constructor() {}

  ngOnInit(): void {
    if (!this.collectionSize) {
      return
    }
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
    
  
   
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.collectionSize) {
      return
    }
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
   
  }

  /** Set page number */
  selectPageNumber(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  /** Set next page number */
  next() {
    const nextPage = this.currentPage + 1;
    nextPage <= this.totalPages.length && this.selectPageNumber(nextPage);
    this.PageChange.emit({pageIndex: this.currentPage, pageSize: this.pageSize, length: this.totalPages.length})
    
  }

  /** Set previous page number */
  previous() {
    const previousPage = this.currentPage - 1;
    previousPage >= 1 && this.selectPageNumber(previousPage);
  }
}
