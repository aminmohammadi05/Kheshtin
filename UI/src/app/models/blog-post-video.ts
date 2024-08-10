import { Blog } from './blog';

export class BlogPostVideo {
    videoId: number;
    name: string;
    videoUrl: string;
    size: number;
    createUserId: number;
    fileExtension: string;
    blogId: string;
    blog: Blog;
}
