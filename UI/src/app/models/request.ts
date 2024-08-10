export class BrandRequest {
    options: string;
    name: string;
    email: string;
    requestText: string;
    constructor(data?) {
        data = data || {};
        this.options = data.options;
        this.name = data.name;
        this.email = data.email;
        this.requestText = data.requestText;
    }
}