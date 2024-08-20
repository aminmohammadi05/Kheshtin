
export class TextureShowRoom {
    productId: string;
    productFileId: number;
    orientation: number;
    bondingColor: number;
    createUserId: number;
    constructor(data?: { productId?: any; productFileId?: any; orientation?: any; bondingColor?: any; createUserId?: any; }) {
        data = data || {};
        this.productId = data.productId;
        this.productFileId = data.productFileId ;
        this.orientation = data.orientation;
        this.bondingColor = data.bondingColor;
        this.createUserId = data.createUserId;
    }
}
