import { Project } from './project';
import { ProjectCategory } from './project-category';

export class ProjectCategorySet {
    projectId: string;
    projectCategoryId: number;
    project: Project;
    projectCategory: ProjectCategory;
    createUserId: number;
}
