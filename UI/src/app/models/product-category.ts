import { Category } from './category';
import { Product } from './product';

export class ProductCategory {
    categoryId: number;
    productId: string;
    display: boolean;
    category: Category;
    product: Product;
}
