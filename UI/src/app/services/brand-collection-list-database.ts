import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';
import { map } from 'rxjs/operators';
import { BrandCollection } from '../models/brand-collection';
import { BrandCollectionService } from './brand-collection.service';

@Injectable()
export class BrandCollectionListDatabase {
    dataChange = new BehaviorSubject<BrandCollection[]>([]);

    get data(): BrandCollection[] { return this.dataChange.value; }

    constructor(private brandCollectionService: BrandCollectionService) {
      this.initialize();
    }

    initialize() {
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      // this.store.pipe(select(getAllBrandCollections),
      // map(brandCollections => {
      //   this.dataChange.next(brandCollections);
      // })).subscribe();
    }
}
