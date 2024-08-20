import { Pagination } from './pagination';
import { Category } from './category';
import { OfficeProjectCategory } from './office-project-category';
import { DesignOffice } from './design-office';

export class DesignOfficeSearch {
    searchId: number;
    designers: DesignOffice[];
    categories: OfficeProjectCategory[];
    searchBox: string;
    public pageQuery: Pagination;
    hashtagObject: any;
    constructor(data?: { searchId?: any; designers?: any; categories?: any; searchBox?: any; pageQuery?: any; hashtagObject?: any; }) {
        data = data || {};
        this.searchId = data.searchId;
        this.designers = data.designers;
        this.categories = data.categories;
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
        this.hashtagObject = data.hashtagObject;
    }
}
