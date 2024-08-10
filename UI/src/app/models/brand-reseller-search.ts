import { Pagination } from './pagination';
import { Category } from './category';

export class BrandResellerSearch {
    searchId: number;
    brandId: string;
    searchBox: string;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.brandId = data.brandId;
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
