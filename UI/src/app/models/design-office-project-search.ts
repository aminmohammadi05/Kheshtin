import { Pagination } from './pagination';
import { OfficeProjectCategory } from './office-project-category';
import { DesignOffice } from './design-office';

export class DesignOfficeProjectSearch {
    searchId: number;
    categories: OfficeProjectCategory[];
    searchBox: string;
    designerId: string;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.categories = data.categories ? data.categories : [];
        this.designerId = data.designerId;
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
