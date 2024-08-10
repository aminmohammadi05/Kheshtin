import { Project } from './project';

export class ProjectImage {
    imageId: number;
    name: string;
    imageUrl: string;
    thumbnail: string;
    size: number;
    createUserId: number;
    fileExtension: string;
    projectId: string;
    project: Project;
}
