import { City } from './city';
import { BrandReseller } from './brand-reseller';
import { User } from './user';

export class Reseller {
    resellerId!: string;
    displayId!: string;
    urlTitle!: string;
    title!: string;
    address!: string;
    phone!: string;
    cityId!: number;
    createUserId!: number;
    createUser!: User;
    city!: City;
    brandResellerList!: BrandReseller[];
}
