import { Pagination } from './pagination';
import { Category } from './category';
import { User } from './user';
import { ProjectCategory } from './project-category';

export class ProjectSearch {
    searchId: number;
    categoriesBox: ProjectCategory[];
    searchBox: string;
    designersBox: User[];
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.searchBox = data.searchBox;
        this.designersBox = data.designersBox ? data.designersBox : [];
        this.pageQuery = data.pageQuery;
    }
}
