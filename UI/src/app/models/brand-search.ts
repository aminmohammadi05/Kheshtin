import { Pagination } from './pagination';
import { Category } from './category';
import { BrandCollection } from './brand-collection';

export class BrandSearch {
    searchId: number;
    categoriesBoxNested: Category[];
    categoriesBox: Category[];
    brandCollectionBox: BrandCollection[];
    searchBox: string;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.categoriesBoxNested = data.categoriesBoxNested ? data.categoriesBoxNested : [];
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.brandCollectionBox = data.brandCollectionBox ? data.brandCollectionBox : [];
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
