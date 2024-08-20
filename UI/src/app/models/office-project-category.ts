import { OfficeProjectCategorySet } from './office-project-category-set';

export class OfficeProjectCategory {
    id!: number;
    categoryName!: string;
    officeProjectCategorySetList: OfficeProjectCategorySet[] = [];
}