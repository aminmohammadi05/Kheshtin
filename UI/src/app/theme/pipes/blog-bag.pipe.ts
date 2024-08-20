import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'blogBagType',
  standalone: true,
  pure: false
})
export class BlogBagTypePipe implements PipeTransform {

  transform(items: any[], checkItem: string): any {
    
    if (!items || !checkItem) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out

    // checkItems.map(x => {
    //   if (items.filter(item => item.fileType === x && !item.parentProductFileId)[0]) {
    //     return items.filter(item => item.fileType === x && !item.parentProductFileId);
    //   }
    // });
    // return [];
    return items.filter(item => item.__typename === checkItem );
}

}
