import { Brand } from './brand';
import { Reseller } from './reseller';
import { User } from './user';

export class BrandReseller {
    brandId!: string;
    resellerId!: string;
    createUserId!: number;
    createUser!: User;
    brand!: Brand;
    reseller!: Reseller;
}
