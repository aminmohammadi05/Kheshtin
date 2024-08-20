import { Pagination } from './pagination';
import { OfficeProjectCategory } from './office-project-category';
import { DesignOffice } from './design-office';

export class OfficeProjectSearch {
    searchId: number;
    categories: OfficeProjectCategory[];
    searchBox: string;
    designers: DesignOffice[];
    hashtagObject: any;
    public pageQuery: Pagination;
    constructor(data?: { searchId?: any; categories?: any; designers?: any; searchBox?: any; hashtagObject?: any; pageQuery?: any; }) {
        data = data || {};
        this.searchId = data.searchId;
        this.categories = data.categories ? data.categories : [];
        this.designers = data.designers ? data.designers : [];
        this.searchBox = data.searchBox;
        this.hashtagObject = data.hashtagObject;
        this.pageQuery = data.pageQuery;
    }
}
