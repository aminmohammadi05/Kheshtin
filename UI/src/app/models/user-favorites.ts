import { User } from './user';
import { Product } from './product';

export class UserFavorites {
    constructor(public userId: number,
                public productId: string,
                public user: User,
                public product: Product) {}
}
