import { ProductBlogPost } from './product-blog-post';
import { BrandBlogPost } from './brand-blog-post';
import { ProjectBlogPost } from './project-blog-post';
import { CategoryBlogPost } from './category-blog-post';
import { BlogPostImage } from './blog-post-image';
import { BlogPostVideo } from './blog-post-video';
import { BlogKeyword } from './blog-keyword';

export class Blog {
    blogId!: string;
    displayId!: string;
    urlTitle!: string;
    blogTitle!: string;
    blogHtmlText!: string;
    blogVisitCount!: number;
    createDate!: string;
    keywordList!: string;
    blogPostCategoryList!: CategoryBlogPost[];
    brandBlogPosts!: BrandBlogPost[];
    projectBlogPosts!: ProjectBlogPost[];
    blogPostImageList!: BlogPostImage[];
    blogPostVideoList!: BlogPostVideo[];
    blogKeywordList!: BlogKeyword[];
}
