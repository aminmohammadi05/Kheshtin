import { BrandCategory } from './brand-category';
import { BrandBlogPost } from './brand-blog-post';
import { BrandReseller } from './brand-reseller';
import { BrandCollection } from './brand-collection';
import { BrandVideo } from './brand-video';
import { OfficeProject } from './office-project';

// Author : Amin Mohammadi
export class DesignOffice {
    officeId!: string;
    displayId!: string;
    id!: number;
    urlTitle!: string;
    name!: string;
    address!: string;
    email!: string;
    webSiteUrl!: string;
    description!: string;
    mobilePhone!: string;
    phoneNumber!: string;
    keywordList!: string;
    thumbnail!: string;
    ratingsCount!: number;
    ratingsValue!: number;
    facebook!: string;
    twitter!: string;
    linkedin!: string;
    instagram!: string;
    officeProjectList!: OfficeProject[];
    totalProjects!: number;
    totalVideos!: number;
}
