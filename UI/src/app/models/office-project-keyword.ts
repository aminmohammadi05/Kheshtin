import { OfficeProject } from "./office-project";


export class OfficeProjectKeyword {
    keywordId: string;
    officeProjectId: string;
    page: string;
    action: string;
    keyword: string;
    value: string;
    officeProject: OfficeProject = new OfficeProject;
    createUserId: number;
    constructor(data?: { keywordId?: any; officeProjectId?: any; page?: any; action?: any; keyword?: any; value?: any; createUserId?: any; }) {
        data = data || {};
        this.keywordId = data.keywordId;
        this.officeProjectId = data.officeProjectId;
        this.page = data.page;
        this.action = data.action;
        this.keyword = data.keyword;
        this.value = data.value;
        this.createUserId = data.createUserId;
    }
}
