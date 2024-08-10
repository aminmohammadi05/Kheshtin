import { Pipe, PipeTransform } from '@angular/core';
import { PageImages } from 'src/app/models/page-images';

@Pipe({
  name: 'page'
})
export class PagePipe implements PipeTransform {

  transform(items: PageImages[], filter: number): any {
    if (!items || !filter) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.pageId === filter);
}

}
