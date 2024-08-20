import { Brand } from './brand';
import { User } from './user';

export class BrandVideo {
    videoId!: string;
    brandId!: string;
    videoTitle!: string;
    videoUrl!: string;
    createUserId!: number;
    createUser!: User;
    brand!: Brand;
}
