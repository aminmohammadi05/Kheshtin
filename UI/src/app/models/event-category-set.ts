import { Event } from './event';
import { EventCategory } from './event-category';

export class EventCategorySet {
    eventId: string;
    eventCategoryId: number;
    event: Event;
    eventCategory: EventCategory;
    createUserId: number;
    constructor(data?) {
        data = data || {};
        this.eventId = data.eventId;
        this.eventCategoryId = data.eventCategoryId;
        this.createUserId = data.createUserId;
    }
}
