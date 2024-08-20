import { Product } from './product';
import { Usage } from './usage';

export class ProductUsage {
    usageId: number;
    productId: string;
    usage: Usage = new Usage;
    product: Product = new Product;
    constructor(data?: { usageId?: any; productId?: any; }) {
        data = data || {};
        this.usageId = data.usageId;
        this.productId = data.productId;
    }
}