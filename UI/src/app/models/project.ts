
import { ProjectImage } from './project-image';
import { ProjectProduct } from './project-product';
import { ProjectCategorySet } from './project-category-set';
import { City } from './city';
import { User } from './user';
import { ProjectComment } from './project-comment';
import { ProjectAdminReply } from './project-admin-reply';
import { ProjectBlogPost } from './project-blog-post';

export class Project {
    projectId: string;
    displayId: string;
    urlTitle: string;
    name: string;
    description: string;
    keywordList: string;
    createUserId: number;
    createDate: number;
    cityId: number;
    projectDevelopmentStatus: number;
    projectStatus: number;
    city: City;
    createUser: User;
    projectCategorySetList: ProjectCategorySet[] = [];
    projectImageList: ProjectImage[] = [];
    projectProductList: ProjectProduct[] = [];
    projectCommentList: ProjectComment[] = [];
    projectAdminReplyList: ProjectAdminReply[] = [];
    projectBlogPosts: ProjectBlogPost[];
}
