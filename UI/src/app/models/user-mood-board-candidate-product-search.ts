import { Pagination } from './pagination';
import { Category } from './category';
import { Brand } from './brand';
import { BrandCollection } from './brand-collection';

export class UserMoodBoardCandidateProductSearch {
    searchId: number;
    brandsBox: Brand[];
    categoriesBoxNested: Category[];
    categoriesBox: Category[];
    brandCollectionBox: BrandCollection[];
    fileTypes: string[];
    colorsBox: string[];
    materialsBox: string[];
    imageUploaded: string;
    searchBox: string;
    vertical: boolean;
    public pageQuery: Pagination;
    constructor(data?: { searchId?: any; brandsBox?: any; categoriesBoxNested?: any; categoriesBox?: any; brandCollectionBox?: any; fileTypes?: any; colorsBox?: any; materialsBox?: any; imageUploaded?: any; searchBox?: any; vertical?: any; pageQuery?: any; }) {
        data = data || {};
        this.searchId = data.searchId;
        this.brandsBox = data.brandsBox ? data.brandsBox : [];
        this.categoriesBoxNested = data.categoriesBoxNested ? data.categoriesBoxNested : [];
        this.categoriesBox = data.categoriesBox ? data.categoriesBox : [];
        this.brandCollectionBox = data.brandCollectionBox ? data.brandCollectionBox : [];
        this.fileTypes = data.fileTypes ? data.fileTypes : [];
        this.colorsBox = data.colorsBox ? data.colorsBox : [];
        this.materialsBox = data.materialsBox ? data.materialsBox : [];
        this.imageUploaded = data.imageUploaded;
        this.searchBox = data.searchBox;
        this.vertical = data.vertical;
        this.pageQuery = data.pageQuery;
    }
}
