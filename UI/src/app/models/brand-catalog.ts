import { Brand } from './brand';
import { User } from './user';

export class BrandCatalog {
    brandCatalogId: string;
    brandId: string;
    title: string;
    catalogImage: string;
    catalogFile: string;
    createDate!: string;
    brand!: Brand;
    constructor(data?: { brandCatalogId?: any; brandId?: any; title?: any; catalogImage?: any; catalogFile?: any; }) {
        data = data || {};
        this.brandCatalogId = data.brandCatalogId;
        this.brandId = data.brandId;
        this.title = data.title;
        this.catalogImage = data.catalogImage;
        this.catalogFile = data.catalogFile;
    }
}
