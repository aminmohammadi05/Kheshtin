import { ProductFile } from './product-file';
import { UserMoodBoard } from './user-moodboard';

export class MoodBoardProduct {
    productId: string;
    productFileId: number;
    fileType: number;
    moodBoardId: string;
    createUserId: number;
    x: number;
    y: number;
    rows: number;
    cols: number;
    layerIndex: number;
    product: ProductFile;
    moodBoardProduct: UserMoodBoard;
    constructor(data?) {
        data = data || {};
        this.layerIndex = data.layerIndex;
        this.productId = data.productId;
        this.productFileId = data.productFileId;
        this.fileType = data.fileType;
        this.moodBoardId = data.moodBoardId;
        this.createUserId = data.createUserId;
        this.x = data.x;
        this.y = data.y;
        this.rows = data.rows;
        this.cols = data.cols;
    }
}