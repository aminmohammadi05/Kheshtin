import { Province } from './province';
import { Project } from './project';

export class City {
    cityId: number;
    cityName: string;
    provinceId: number;
    province: Province;
    projectList: Project[] = [];
}
