import { Pipe, PipeTransform } from '@angular/core';
import { ProductFile } from 'src/app/models/product-file';
import { FileToUpload } from '../../models/file-to-upload';

@Pipe({
  name: 'fileType',
  pure: false,
  standalone: true,
})
export class FileTypePipe implements PipeTransform {

  transform(items: any[], ...checkItems: number[]): any {
    
    if (!items || !checkItems) {
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
    return items.filter(item => checkItems.includes(+item.fileType.contentItems[0].id.split('-')[1]) );
}

}
