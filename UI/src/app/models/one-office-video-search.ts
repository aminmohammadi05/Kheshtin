import { Pagination } from './pagination';
import { OfficeProjectCategory } from './office-project-category';
import { DesignOffice } from './design-office';

export class OneOfficeVideoSearch {
    searchId: number;
    searchBox: string;
    designerId: string;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.designerId = data.designerId;
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
