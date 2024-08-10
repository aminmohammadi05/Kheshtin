import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe';
import { FilterNeighborhoodsPipe } from './filter-neighborhoods';
import { FilterStreetsPipe } from './filter-streets.pipe';
import { FilterCitiesPipe } from './filter-cities.pipe';
import { PagePipe } from './page.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FileTypePipe } from './file-type.pipe';
import { BlogBagTypePipe } from './blog-bag.pipe';
import { OrderByPipe } from './order-by.pipe';

@NgModule({
   imports: [
      CommonModule
   ],
   declarations: [
      FilterByIdPipe,
      FilterNeighborhoodsPipe,
      FilterStreetsPipe,
      FilterCitiesPipe,
      SafeHtmlPipe,
      FileTypePipe,
      BlogBagTypePipe,
      PagePipe,
      OrderByPipe
   ],
   exports: [
      FilterByIdPipe,
      FilterNeighborhoodsPipe,
      FilterStreetsPipe,
      FilterCitiesPipe,
      SafeHtmlPipe,
      FileTypePipe,
      BlogBagTypePipe,
      PagePipe,
      OrderByPipe
   ]
})
export class PipesModule { }
