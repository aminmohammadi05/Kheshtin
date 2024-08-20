
import { DesignOffice } from './design-office';
import { User } from './user';

export class DesignOfficeVideo {
    videoId!: string;
    designOfficeId!: string;
    videoTitle!: string;
    videoUrl!: string;
    createUserId!: number;
    createUser!: User;
    designOffice!: DesignOffice;
}
