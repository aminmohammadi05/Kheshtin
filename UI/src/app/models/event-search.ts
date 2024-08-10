import { Pagination } from './pagination';
import { EventCategory } from './event-category';

export class EventSearch {
    searchId: number;
    categories: EventCategory[];
    searchBox: string;
    hashtagObject: any;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.categories = data.categories ? data.categories : [];
        this.searchBox = data.searchBox;
        this.hashtagObject = data.hashtagObject;
        this.pageQuery = data.pageQuery;
    }
}
