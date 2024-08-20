

import { EventImage } from './event-image';
import { EventVideo } from './event-video';
import { EventKeyword } from './event-keyword';
import { EventCategorySet } from './event-category-set';

export class Event {
    eventId: string;
    parentEventId: string;
    displayId:          string;
    urlTitle: string;
    eventTitle: string;
    eventHtmlText: string;    
    visitCount!: number;
    keywordList: string;
    eventDate: Date;
    createDate!: string;
    createUserId: number;
    subEventList: Event[] = [];
    eventImageList: EventImage[] = [];
    eventVideoList: EventVideo[] = [];
    eventKeywordList: EventKeyword[] = [];
    eventCategorySetList: EventCategorySet[] = [];

    constructor(data?: { eventId?: any; parentEventId?: any; urlTitle?: any; displayId?: any; eventDate?: any; eventTitle?: any; eventHtmlText?: any; keywordList?: any; eventKeywordList?: any; createUserId?: any; subEventList?: any; eventImageList?: any; eventVideoList?: any; eventCategorySetList?: any; }) {
        data = data || {};
        this.eventId = data.eventId;
        this.parentEventId = data.parentEventId;
        this.urlTitle = data.urlTitle;
        this.displayId = data.displayId;
        this.eventDate = data.eventDate;
        this.eventTitle = data.eventTitle;
        this.eventHtmlText = data.eventHtmlText;
        this.keywordList = data.keywordList;
        this.eventKeywordList = data.eventKeywordList;
        this.createUserId = data.createUserId;
        this.subEventList = data.subEventList;
        this.eventImageList = data.eventImageList;
        this.eventVideoList = data.eventVideoList;
        this.eventCategorySetList = data.eventCategorySetList;
    }
}
