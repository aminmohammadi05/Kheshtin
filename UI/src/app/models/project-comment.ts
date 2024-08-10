import { User } from './user';
import { Project } from './project';

export class ProjectComment {
    commentId: number;
    projectId: string;
    createUserId: number;
    title: string;
    comment: string;
    commentAdminStatus: number;
    commentOwnerStatus: number;
    createUser: User;
    project: Project;
}
