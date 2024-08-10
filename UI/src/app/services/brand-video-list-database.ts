import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';
import { map } from 'rxjs/operators';
import { BrandVideo } from '../models/brand-video';
import { BrandVideoService } from './brand-video.service';

@Injectable()
export class BrandVideoListDatabase {
    dataChange = new BehaviorSubject<BrandVideo[]>([]);

    get data(): BrandVideo[] { return this.dataChange.value; }

    constructor(private brandVideoService: BrandVideoService) {
      this.initialize();
    }

    initialize() {
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      // this.store.pipe(select(getAllBrandVideos),
      // map(brandVideos => {
      //   this.dataChange.next(brandVideos);
      // })).subscribe();
    }
}
