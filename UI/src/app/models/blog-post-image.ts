import { Blog } from './blog';

export class BlogPostImage {
    imageId: number;
    name: string;
    imageUrl: string;
    thumbnail: string;
    size: number;
    createUserId: number;
    fileExtension: string;
    blogId: string;
    blog: Blog;
}
