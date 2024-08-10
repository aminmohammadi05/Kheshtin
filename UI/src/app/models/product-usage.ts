import { Product } from './product';
import { Usage } from './usage';

export class ProductUsage {
    usageId: number;
    productId: string;
    usage: Usage;
    product: Product;
    constructor(data?) {
        data = data || {};
        this.usageId = data.usageId;
        this.productId = data.productId;
    }
}