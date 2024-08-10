import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';
import { map } from 'rxjs/operators';
import { BrandCollection } from '../models/brand-collection';
import { BrandCollectionService } from './brand-collection.service';
import { OfficeProjectCategory } from '../models/office-project-category';
import { OfficeProjectService } from './office-project.service';

@Injectable()
export class OfficeProjectCategoriesListDatabase {
    dataChange = new BehaviorSubject<OfficeProjectCategory[]>([]);

    get data(): OfficeProjectCategory[] { return this.dataChange.value; }

    constructor(private officeProjectCategoryService: OfficeProjectService) {
      this.initialize();
    }

    initialize() {
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      // this.store.pipe(select(getAllOfficeProjectCategories),
      // map(categories => {
      //   this.dataChange.next(categories);
      // })).subscribe();
    }
}
