import { Product } from './product';
import { ProductFile } from './product-file';

export class UserMoodBoardCandidateProduct {
    productId: string;
    createUserId: number;
    product: Product = new Product;
    constructor(data?: { productId?: any; createUserId?: any; }) {
        data = data || {};
        this.productId = data.productId;
        this.createUserId = data.createUserId;
    }
}