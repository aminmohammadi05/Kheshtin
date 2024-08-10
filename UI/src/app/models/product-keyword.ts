import { Product } from './product';

export class ProductKeyword {
    keywordId: string;
    productId: string;
    page: string;
    action: string;
    keyword: string;
    value: string;
    product: Product;
    createUserId: number;
    constructor(data?) {
        data = data || {};
        this.productId = data.productId;
        this.page = data.page;
        this.action = data.action;
        this.keyword = data.keyword;
        this.createUserId = data.createUserId;
    }
}
