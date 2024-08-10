import { MoodBoardProduct } from './moodboard-product';

export class UserMoodBoard {
    moodBoardId: string;
    displayId: string;
    urlTitle: string;
    moodBoardName: string;
    moodBoardDescription: string;
    backgroundColor: string;
    totalCols: number;
    totalRows: number;
    moodBoardProductList: MoodBoardProduct[] = [];
    createUserId: number;
    constructor(data?) {
        data = data || {};
        this.moodBoardId = data.moodBoardId;
        this.urlTitle = data.urlTitle;
        this.moodBoardName = data.moodBoardName ;
        this.moodBoardDescription = data.moodBoardDescription;
        this.backgroundColor = data.backgroundColor;
        this.moodBoardProductList = data.moodBoardProductList ? data.moodBoardProductList : [];
        this.totalCols = data.totalCols;
        this.totalRows = data.totalRows;
        this.createUserId = data.createUserId;
    }
}
