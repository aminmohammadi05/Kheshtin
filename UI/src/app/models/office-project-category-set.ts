import { OfficeProject } from './office-project';
import { OfficeProjectCategory } from './office-project-category';

export class OfficeProjectCategorySet {
    officeProjectId!: string;
    officeProjectCategoryId!: number;
    officeProject!: OfficeProject;
    officeProjectCategory!: OfficeProjectCategory;
}
