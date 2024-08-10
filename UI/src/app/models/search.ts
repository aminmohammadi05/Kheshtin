import { Pagination } from './pagination';
import { Category } from './category';
import { Brand } from './brand';
import { BrandCollection } from './brand-collection';

export class Search {
    searchId: number;
    brandsBox: Brand[];
    categoriesBoxNested: Category[];
    categoriesBox: Category[];
    brandCollectionBox: BrandCollection[];
    fileTypes: string[];
    imageUploaded: string;
    searchBox: string;
    vertical: boolean;
    public pageQuery: Pagination;
    constructor(data?) {
        data = data || {};
        this.searchId = data.searchId;
        this.brandsBox = data.brandsBox ? data.brandsBox : [];
        this.categoriesBoxNested = data.categoriesBoxNested ? data.categoriesBoxNested : [];
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.brandCollectionBox = data.brandCollectionBox ? data.brandCollectionBox : [];
        this.fileTypes = data.fileTypes ? data.fileTypes : [];
        this.imageUploaded = data.imageUploaded;
        this.searchBox = data.searchBox;
        this.vertical = data.vertical;
        this.pageQuery = data.pageQuery;
    }
}
