import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';
import { map } from 'rxjs/operators';
import { BrandCatalog } from '../models/brand-catalog';
import { BrandCatalogService } from './brand-catalog.service';

@Injectable()
export class BrandCatalogListDatabase {
    dataChange = new BehaviorSubject<BrandCatalog[]>([]);

    get data(): BrandCatalog[] { return this.dataChange.value; }

    constructor(private brandCatalogService: BrandCatalogService) {
      this.initialize();
    }

    initialize() {
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      // this.store.pipe(select(getAllBrandCatalogs),
      // map(brandCatalogs => {
      //   this.dataChange.next(brandCatalogs);
      // })).subscribe();
    }
}
