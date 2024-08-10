import { Pagination } from './pagination';
import { Category } from './category';

export class BlogSearch {
    searchId: number;
    categoriesBoxNested: Category[];
    categoriesBox: Category[];
    searchBox: string;
    hashtagObject: any;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.categoriesBoxNested = data.categoriesBoxNested ? data.categoriesBoxNested : [];
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.searchBox = data.searchBox;
        this.hashtagObject = data.hashtagObject;
        this.pageQuery = data.pageQuery;
    }
}
