
import { ProjectImage } from './project-image';
import { ProjectProduct } from './project-product';
import { ProjectCategorySet } from './project-category-set';
import { City } from './city';
import { User } from './user';

import { OfficeProjectCategorySet } from './office-project-category-set';
import { OfficeProjectImage } from './office-project-image';
import { OfficeProjectProduct } from './office-project-product';
import { DesignOffice } from './design-office';
import { OfficeProjectKeyword } from './office-project-keyword';

export class OfficeProject {
    projectId!: string;
    displayId!: string;
    urlTitle!: string;
    name!: string;
    designers!: string;
    mainArchitectures!: string;
    area!: string;
    buildingDate!: string;
    designOfficeId!: string;
    employer!: string;
    address!: string;
    description!: string;
    extraDescription!: string;
    keywordList!: string;
    createUserId!: number;
    createDate!: string;
    createUser!: User;
    designOffice!: DesignOffice;
    officeProjectCategorySetList: OfficeProjectCategorySet[] = [];
    officeProjectImageList: OfficeProjectImage[] = [];
    officeProjectProductList: OfficeProjectProduct[] = [];
    officeProjectKeywordList: OfficeProjectKeyword[] = [];
}
