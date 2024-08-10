import { Product } from './product';
import { ProductFile } from './product-file';

export class UserMoodBoardCandidateProduct {
    productId: string;
    createUserId: number;
    product: Product;
    constructor(data?) {
        data = data || {};
        this.productId = data.productId;
        this.createUserId = data.createUserId;
    }
}