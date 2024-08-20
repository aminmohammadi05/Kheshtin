import { Project } from './project';
import { User } from './user';

export class ProjectAdminReply {
    replyId!: number;
    projectId!: string;
    title!: string;
    comment!: string;
    answer!: string;
    createDate!: string;
    replyStatus!: number;
    createUserId!: number;
    createUser!: User;
    project!: Project;
}
