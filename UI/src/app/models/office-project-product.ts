import { Product } from './product';
import { OfficeProject } from './office-project';

export class OfficeProjectProduct {
    officeProjectId!: string;
    productId!: string;
    officeProject!: OfficeProject;
    product!: Product;
}
