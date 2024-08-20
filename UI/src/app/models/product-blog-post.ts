import { Blog } from './blog';
import { Product } from './product';

export class ProductBlogPost {
    productId!: string;
    blogId!: string;
    blog!: Blog;
    product!: Product;
}
