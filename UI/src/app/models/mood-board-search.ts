import { Pagination } from './pagination';
import { Category } from './category';

export class MoodBoardSearch {
    searchId: number;
    categoriesBoxNested: Category[];
    categoriesBox: Category[];
    userId: number;
    searchBox: string;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.categoriesBoxNested = data.categoriesBoxNested ? data.categoriesBoxNested : [];
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.userId = data.userId;
        this.searchBox = data.searchBox;
        this.pageQuery = data.pageQuery;
    }
}
