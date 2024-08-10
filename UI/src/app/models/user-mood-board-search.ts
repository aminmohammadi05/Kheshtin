import { Pagination } from './pagination';
import { Category } from './category';

export class UserMoodBoardSearch {
    searchId: number;
    categoriesBoxNested: Category[];
    categoriesBox: Category[];
    searchBox: string;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.categoriesBoxNested = data.categoriesBoxNested ? data.categoriesBoxNested : [];
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
