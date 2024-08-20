import { ProjectCategorySet } from './project-category-set';

export class ProjectCategory {
    id!: number;
    categoryName!: string;
    projectCategorySetList: ProjectCategorySet[] = [];
}
