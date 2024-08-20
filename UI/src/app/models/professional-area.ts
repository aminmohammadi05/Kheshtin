import { UserProfessionalArea } from './user-professional-area';

export class ProfessionalArea {
    professionalAreaId!: number;
    professionalAreaName!: string;
    userProfessionalAreaList: UserProfessionalArea[] = [];
}
