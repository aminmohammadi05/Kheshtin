import { OfficeProject } from "./office-project";


export class OfficeProjectKeyword {
    keywordId: string;
    officeProjectId: string;
    page: string;
    action: string;
    keyword: string;
    value: string;
    officeProject: OfficeProject;
    createUserId: number;
    constructor(data?) {
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
