import { City } from './city';

export class Province {
    provinceId!: number;
    provinceName!: string;
    cityList: City[] = [];
}
