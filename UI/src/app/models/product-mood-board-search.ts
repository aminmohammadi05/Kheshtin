import { Pagination } from './pagination';
import { Category } from './category';
import { Brand } from './brand';
import { BrandCollection } from './brand-collection';

export class ProductMoodBoardSearch {
    searchId: number;
    brandsBox: Brand[];
    categoriesBox: Category[];
    colorsBox: string[];
    materialsBox: string[];
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.brandsBox = data.brandsBox ? data.brandsBox : [];
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.colorsBox = data.colorsBox ? data.colorsBox : [];
        this.materialsBox = data.materialsBox ? data.materialsBox : [];
        this.pageQuery = data.pageQuery;
    }
}
