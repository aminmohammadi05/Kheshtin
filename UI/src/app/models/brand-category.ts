import { Product } from './product';
import { Category } from './category';
import { Brand } from './brand';

// Author : Amin Mohammadi
export class BrandCategory {
    categoryId!: number;
    brandId!: string;
    totalProducts!: number;
    category!: Category;
    brand!: Brand;
}
