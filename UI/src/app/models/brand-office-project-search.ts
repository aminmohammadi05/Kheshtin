import { Pagination } from './pagination';
import { OfficeProjectCategory } from './office-project-category';
import { DesignOffice } from './design-office';

export class BrandOfficeProjectSearch {
    searchId: number;
    brandId: string;
    categories: OfficeProjectCategory[];
    searchBox: string;
    designers: DesignOffice[];
    public pageQuery: Pagination;
    constructor(data?: { searchId?: any; brandId?: any; categories?: any; designers?: any; searchBox?: any; pageQuery?: any; }) {
        data = data || {};
        this.searchId = data.searchId;
        this.brandId = data.brandId;
        this.categories = data.categories ? data.categories : [];
        this.designers = data.designers ? data.designers : [];
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
