import { Project } from './project';
import { Product } from './product';

export class ProjectProduct {
    projectId!: string;
    productId!: string;
    project!: Project;
    product!: Product;
    createUserId!: number;
}
