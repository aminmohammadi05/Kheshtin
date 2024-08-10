import { Event } from './event';

export class EventKeyword {
    keywordId: string;
    eventId: string;
    page: string;
    action: string;
    keyword: string;
    value: string;
    event: Event;
    createUserId: number;
    constructor(data?) {
        data = data || {};
        this.keywordId = data.keywordId;
        this.eventId = data.eventId;
        this.page = data.page;
        this.action = data.action;
        this.keyword = data.keyword;
        this.value = data.value;
        this.createUserId = data.createUserId;
    }
}
