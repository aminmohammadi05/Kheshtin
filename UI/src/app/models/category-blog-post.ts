import { Blog } from './blog';
import { Category } from './category';

export class CategoryBlogPost {
    blogId!: string;
    categoryId!: number;
    blog!: Blog;
    category!: Category;
}
