

import { ProductFile } from './product-file';
import { BrandCategory } from './brand-category';
import { UserFavorites } from './user-favorites';
import { ProductBlogPost } from './product-blog-post';
import { ProductKeyword } from './product-keyword';
import { ProductCategory } from './product-category';
import { Brand } from './brand';
import { BrandProductCollection } from './brand-product-collection';
import { UserMoodBoardCandidateProduct } from './user-mood-board-candidate-product';
import { ProductUsage } from './product-usage';

// Author : Amin Mohammadi
export class Product {
    productId: string;
    displayId: string;
    urlTitle: string;
    name: string;
    description: string;
    productionCode: string;
    productStatus: number;
    ratingsCount: number;
    ratingsValue: number;
    keywordList: string;
    isInCompareList: boolean;
    isInImageSearchResultList: boolean;
    createDate: string;
    brandProductCollectionList: BrandProductCollection[] = [];
    productFiles: ProductFile[] = [];
    userFavorites: UserFavorites[] = [];
    productBlogPosts: ProductBlogPost[];
    productKeywordList: ProductKeyword[] = [];
    productCategoryList: ProductCategory[] = [];
    userMoodBoardCandidateProduct: UserMoodBoardCandidateProduct[] = [];
    productUsages: ProductUsage[] = [];
}
