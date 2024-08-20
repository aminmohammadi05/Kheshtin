import { Pagination } from './pagination';
import { Category } from './category';

export class BrandCatalogSearch {
    searchId: number;
    brandId: string;
    searchBox: string;
    public pageQuery: Pagination;
    constructor(data?: { searchId?: any; brandId?: any; searchBox?: any; pageQuery?: any; }) {
        data = data || {};
        this.searchId = data.searchId;
        this.brandId = data.brandId;
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
