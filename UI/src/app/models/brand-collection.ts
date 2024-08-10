import { Brand } from './brand';
import { BrandProductCollection } from './brand-product-collection';
import { User } from './user';

export class BrandCollection {
    brandCollectionId: string;
    brandId: string;
    title: string;
    collectionImage: string;
    createUserId: number;
    createDate: string;
    createUser: User;
    brand: Brand;
    brandProductCollectionList: BrandProductCollection[];
}
