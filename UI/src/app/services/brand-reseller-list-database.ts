import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';
import { map } from 'rxjs/operators';
import { BrandReseller } from '../models/brand-reseller';
import { BrandResellerService } from './brand-reseller.service';

@Injectable()
export class BrandResellerListDatabase {
    dataChange = new BehaviorSubject<BrandReseller[]>([]);

    get data(): BrandReseller[] { return this.dataChange.value; }

    constructor(private brandResellerService: BrandResellerService) {
      this.initialize();
    }

    initialize() {
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      // this.store.pipe(select(getAllBrandResellers),
      // map(brandResellers => {
      //   this.dataChange.next(brandResellers);
      // })).subscribe();
    }
}
