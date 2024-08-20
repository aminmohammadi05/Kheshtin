import { BrandCategory } from './brand-category';
import { BrandBlogPost } from './brand-blog-post';
import { BrandReseller } from './brand-reseller';
import { BrandCollection } from './brand-collection';
import { BrandVideo } from './brand-video';
import { BrandCatalog } from './brand-catalog';
import { BrandApp } from './brand-app';

// Author : Amin Mohammadi
export class Brand {
    brandId!: string;
    displayId!: string;
    urlTitle!: string;
    name!: string;
    showInMenu!: boolean;
    address!: string;
    email!: string;
    webSiteUrl!: string;
    history!: string;
    mobilePhone!: string;
    phoneNumber!: string;
    brandStatus!: number;
    brandPaymentStatus!: number;
    keywordList!: string;
    thumbnail!: string;
    thumbnailMenu!: string;
    ratingsCount!: number;
    ratingsValue!: number;
    facebook!: string;
    twitter!: string;
    linkedin!: string;
    instagram!: string;
    brandCategoryList!: BrandCategory[];
    brandBlogPosts!: BrandBlogPost[];
    brandResellerList!: BrandReseller[];
    brandCollectionList!: BrandCollection[];
    brandVideoList!: BrandVideo[];
    brandCatalogList!: BrandCatalog[];
    brandAppList!: BrandApp[];
    totalCatalogs!: number;
    totalCollections!: number;
    totalVideos!: number;
    totalResellers!: number;
    totalProducts!: number;
    totalOfficeProjects!: number;
}
