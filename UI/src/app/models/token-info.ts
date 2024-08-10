import { Pagination } from './pagination';
import { Category } from './category';
import { Brand } from './brand';
import { BrandCollection } from './brand-collection';

export class TokenInfo {
    token: string;
    email: string;
    constructor(data?) {
        data = data || {};
        this.token = data.token;
        this.email = data.email;
    }
}
