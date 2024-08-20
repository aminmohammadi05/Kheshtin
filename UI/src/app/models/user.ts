import { UserProfessionalArea } from './user-professional-area';
import { Login } from './login';
import { UserFavorites } from './user-favorites';
import { Project } from './project';


export class User {
    id!: number;
    userName!: string;
    password!: string;
    name!: string;
    lastName!: string;
    phoneNumber!: string;
    mobilePhone!: string;
    address!: string;
    email!: string;
    postalCode!: string;
    otherProfessionalArea!: string;
    businessName!: string;
    webSiteUrl!: string;
    facebookProfileUrl!: string;
    twitterProfileUrl!: string;
    linkedInProfileUrl!: string;
    profilePicture!: string;
    userProfessionalAreaList: UserProfessionalArea[] = [];
    userLoginList: Login[] = [];
    userFavorites: UserFavorites[] = [];
    projects: Project[] = [];
}
