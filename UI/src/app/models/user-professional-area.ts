import { User } from './user';
import { ProfessionalArea } from './professional-area';

export class UserProfessionalArea {
    userId: number;
    professionalAreaId: number;
    user: User;
    professionalArea: ProfessionalArea;
}
