import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCities'
})
export class FilterCitiesPipe implements PipeTransform {

  transform(items: Array<any>, id?) {
    if (id) {
      return items.filter(item => item.provinceId === id);
    }
    return items;
  }

}
