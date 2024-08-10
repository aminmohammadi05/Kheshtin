import { BrandCategory } from './brand-category';
import { ProductCategory } from './product-category';

export class Category {
    categoryId: number;
    name: string;
    parentCategoryId: number;
    deleted: boolean;
    parentCategory: Category;
    childrenCategories: Category[] = [];
    brandCategoryList: BrandCategory[] = [];
    productCategoryList: ProductCategory[] = [];
}
