import { OfficeProject } from './office-project';

export class OfficeProjectImage {
    imageId: number;
    name: string;
    imageUrl: string;
    thumbnail: string;
    size: number;
    createUserId: number;
    fileExtension: string;
    officeProjectId: string;
    officeProject: OfficeProject;
}