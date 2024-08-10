import { User } from './user';

export class Login {
    constructor(public token: string,
                public refreshToken: string,
                public userId: number,
                public user: User) {

    }
}
