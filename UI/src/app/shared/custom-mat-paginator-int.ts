import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class CustomMatPaginatorInt extends MatPaginatorIntl {

  itemsPerPageLabel = 'تعداد آیتم ها در هر صفحه';
  nextPageLabel = 'صفحه بعد';
  previousPageLabel = 'صفحه قبل';
  firstPageLabel = 'اولین صفحه';
  lastPageLabel = 'آخرین صفحه';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return '0 از ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' از ' + length;
  }

}
