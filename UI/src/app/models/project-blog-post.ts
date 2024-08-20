import { Project } from './project';
import { Blog } from './blog';

export class ProjectBlogPost {
    projectId!: string;
    blogId!: string;
    project!: Project;
    blog!: Blog;
}
