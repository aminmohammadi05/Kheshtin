import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';
import { map } from 'rxjs/operators';
import { BrandCollection } from '../models/brand-collection';
import { BrandCollectionService } from './brand-collection.service';
import { EventCategory } from '../models/event-category';
import { EventService } from './event.service';

@Injectable()
export class EventCategoriesListDatabase {
    dataChange = new BehaviorSubject<EventCategory[]>([]);

    get data(): EventCategory[] { return this.dataChange.value; }

    constructor(private officeProjectCategoryService: EventService) {
      this.initialize();
    }

    initialize() {
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      // this.store.pipe(select(getAllEventCategories),
      // map(categories => {
      //   this.dataChange.next(categories);
      // })).subscribe();
    }
}
