import { Blog } from './blog';
import { Brand } from './brand';

export class BrandBlogPost {
    blogId!: string;
    brandId!: string;
    blog!: Blog;
    brand!: Brand;
}
